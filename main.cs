using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.ServiceModel.Syndication;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Microsoft.SharePoint.Client;
using System.IO;
using System.Globalization;
using System.Threading;
using System.Net;
using System.Diagnostics;

namespace PlaygroundRSSConsole
{
    class Program
    {
        static string[] urls =
        {
           // "http://fetchrss.com/rss/5e7399608a93f8e73a8b45685e7399328a93f822388b4567.atom",
           // "https://www.news.gov.hk/tc/categories/health/html/articlelist.rss.xml",
            "https://www.edb.gov.hk/tc/whats_new_rss.xml",
           // "https://www.lcsd.gov.hk/tc/emagazine/emag_rss.xml",
           // "https://www.censtatd.gov.hk/feed.jsp?charsetID=2",
           // "https://www.consumer.org.hk/ws_chi/rss/news.rss",
           // "http://www.pcpd.org.hk/tc_chi/rss/rss_news_tc.xml"
        };
        static string[] types =
        {
            "facebook",
            "www.news.gov.hk",
            "www.edb.gov.hk",
            "www.lcsd.gov.hk",
            "www.censtatd.gov.hk",
            "www.consumer.org.hk",
            "www.pcpd.org.hk"
        };
        static void Main(string[] args)
        {
            string username = "test1@quantr.hk";
           // string username = "km_approve@hkpa.hk";
           
            //string password = Console.ReadLine();
            //string password = "";

           // ClientContext context = new ClientContext("https://quantr.sharepoint.com/pa");
            ClientContext context = new ClientContext("http://hkpakmsp02/");

           // context.Credentials = new SharePointOnlineCredentials(username, ToSecureString(password));
            Web web = context.Web;
            context.Load(web);
            context.ExecuteQuery();
            List list = context.Web.Lists.GetByTitle("RSS");

            ListItemCollection listItems = list.GetItems(CamlQuery.CreateAllItemsQuery());
            context.Load(listItems,
                                eachItem => eachItem.Include(
                                item => item,
                                item => item["ID"]));
            context.ExecuteQuery();

            var totalListItems = listItems.Count;
            if (totalListItems > 0)
            {
                for (var counter = totalListItems - 1; counter > -1; counter--)
                {
                    listItems[counter].DeleteObject();
                    //context.ExecuteQuery();
                    //Console.WriteLine("Row: " + counter + " Item Deleted");
                }
            }

            int x = 0;
            foreach (string url in urls)
            {
                try
                {
                    string xml;
                    string newXML;

                    using (WebClient webClient = new WebClient())
                    {
                        xml = Encoding.UTF8.GetString(webClient.DownloadData(url));
                        XmlDocument xmlDoc = new XmlDocument(); // Create an XML document object
                        xmlDoc.Load(url); // Load the XML document from the specified file

                        // Get elements
                        XmlNodeList rawDate = xmlDoc.GetElementsByTagName("pubDate");
                       for(int i=0;i<rawDate.Count; i++)
                        {
                            string pubDate = rawDate[i].InnerXml;
                            pubDate = pubDate.Replace("年", "-");
                            pubDate = pubDate.Replace("月", "-");
                            pubDate = pubDate.Replace("日", "");
                             pubDate = DateTime.Parse(pubDate).ToString("ddd, dd MMM yyyy HH:mm:ss zzz");
                            rawDate[i].InnerXml = pubDate;

                            // Display the results
                           Console.WriteLine("Date: " + pubDate);
                            Console.WriteLine("rawDate: " + rawDate[i].InnerXml);


                        }
                        xmlDoc.Save(Console.Out);
                       
                        Console.WriteLine("xml-new: ");

                    }


                    // xml = xml.Replace("年", "-");
                    // xml = xml.Replace("月", "-");
                    // xml = xml.Replace("日", "");

                    byte[] bytes = System.Text.UTF8Encoding.ASCII.GetBytes(xml);
                    XmlReader reader = XmlReader.Create(new MemoryStream(bytes));
                    SyndicationFeed feed = SyndicationFeed.Load(reader);
                    Console.WriteLine("feed: " + feed);


                    reader.Close();
                    foreach (SyndicationItem item in feed.Items)
                    {
                        Console.WriteLine(item.PublishDate);

                        Console.WriteLine(item.PublishDate.ToString("yyyy/MM/dd") + " : " + item.Title.Text);


                        ListItemCreationInformation itemCreateInfo = new ListItemCreationInformation();
                        ListItem oListItem = list.AddItem(itemCreateInfo);
                        oListItem["Title"] = item.Title.Text;
                        if (types[x] == "facebook")
                        {
                            oListItem["PublishDate"] = item.LastUpdatedTime;
                            oListItem["Summary"] = ((TextSyndicationContent)item.Content).Text;
                        }
                        else
                        {
                            //oListItem["PublishDate"] = item.PublishDate.ToString("yyyy-MM-dd HH:mm:ss");

                            Console.WriteLine(item.PublishDate);

                            oListItem["PublishDate"] = item.PublishDate.ToString("yyyy-MM-dd HH:mm:ss");

                            oListItem["Summary"] = item.Summary.Text.Replace("<img", "<img class=\"img-fluid\"");
                        }

                        var links = "";
                        foreach (SyndicationLink link in item.Links)
                        {
                            links += link.Uri + "\n";
                        }
                        oListItem["Links"] = links;
                        oListItem["RSSType"] = types[x];

                       // oListItem.Update();

                        //context.ExecuteQuery();
                        //if (1 < 2)
                        //{
                        //    return;
                        //}
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(url);
                    Console.WriteLine(ex.Message);
                }
                x++;
            }
            Console.ReadLine();
        }
        static SecureString ToSecureString(string source)
        {
            if (string.IsNullOrWhiteSpace(source))
                return null;
            else
            {
                SecureString result = new SecureString();
                foreach (char c in source.ToCharArray())
                    result.AppendChar(c);
                return result;
            }
        }

    }
}

