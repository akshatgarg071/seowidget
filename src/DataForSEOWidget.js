import React, { useState, useEffect } from "react";
import "./Data.css";
import axios from "axios";

const DataForSEOWidget = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataArray, setdataArray] = useState([]);
  const endpoints = [
    "duplicate_content",
    "duplicate_tags",
    "instant_pages",
    "keyword_density",
    "links",
    "non_indexable",
    "pages",
    "pages_by_resource",
    "page_screenshot",
    "raw_html",
    "redirect_chains",
  ];

  const [scoreColor, setScoreColor] = useState("green"); 

  const getScoreColor = (onpageScore) => {
    if (onpageScore > 80) {
      return "green";
    } else if (onpageScore > 60) {
      return "orange";
    } else {
      return "red";
    }
  };

  const fetchScreenshot = async () => {
    try {
      const response = await axios.post(
        "https://api.dataforseo.com/v3/on_page/page_screenshot",
        {
          url: url,
          width: 1200, 
          height: 800, 
        },
        {
          auth: {
            username: "akshatg2024@gmail.com", 
            password: "7c252dfbe8132edc", 
          },
          headers: {
            "content-type": "application/json",
          },
        },
      );

      const screenshotData = response.data.result[0];

      if (screenshotData && screenshotData.screenshot) {
        setResult(screenshotData);
      } else {
        setResult(null);
        console.error("No screenshot data found");
      }
    } catch (error) {
      console.error("Error fetching screenshot:", error);
      setResult(null);
    }
  };

  const fetchAllEndpointData = (endpoint) => {
    setLoading(true);
    const post_array = [];
    post_array.push({
      url: url,
      enable_javascript: true,
      load_resources: true,
      enable_browser_rendering: true,
      custom_js: "meta = {}; meta.url = document.URL; meta;",
    });

    return axios({
      method: "post",
      url: "https://api.dataforseo.com/v3/on_page/instant_pages",
      auth: {
        username: "akshatg2024@gmail.com", 
        password: "7c252dfbe8132edc", 
      },
      data: post_array,
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => {
        var data = response["data"]["tasks"];
        console.log(
          "Server Response : " +
            data[0].status_message +
            "\nserver cost : " +
            data[0].cost +
            "\ntime : " +
            data[0].time +
            "\ntask id : " +
            data[0].id,
        );
        var resultData = data[0].result[0].items[0]; 
        setResult(resultData);
      })
      .catch((error) => {
        console.error(`Error fetching data for ${endpoint}:`, error);
        return [];
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  return (
    <div className="data-for-seo-widget">
      <h1 className="widget-heading">Get a free SEO Audit Report</h1>
      <div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-box" 
          placeholder="Enter URL"
        />
        <button
          onClick={() => {
            fetchAllEndpointData();
            fetchScreenshot();
          }}
        >
          Check URL
        </button>
      </div>
      {loading && (
        <div className="loading-animation">
          <div className="loader"></div>
          <p>Please wait for a moment, do not refresh the page...</p>
        </div>
      )}
      {!loading && result && (
        <div>
          <div className="top">
            {result ? (
              <>
                <div
                  className={`score-container ${getScoreColor(
                    result.onpage_score,
                  )}`}
                >
                  <h4>Onpage Score:</h4>
                  <div className="circle">
                    <span id="percentage">{result.onpage_score}%</span>
                  </div>
                </div>
                <h2>Page status : {result.status_code}</h2>
                <h3>
                  <img src={result.meta.favicon} alt="Favicon" />
                  <br />
                  <br />
                  Meta Title : "{result.meta.title}"
                </h3>
              </>
            ) : (
              <p>Loading data...</p>
            )}
          </div>

          <h2 className="section-heading" style={{ fontSize: "30px" }}>
            Meta Data
          </h2>
          <ul
            className="instant_pages_metaData score_table grid-container"
            
          >
            <li className="grid-item">
              <span className="custom-text">
                {result.meta.internal_links_count}
              </span>
              <br></br> Internal Links
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.meta.external_links_count}
              </span>
              <br></br> External Links
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.meta.inbound_links_count}
              </span>
              <br></br> Inbound Links
            </li>
            <li className="grid-item">
              <span className="custom-text">{result.meta.images_count}</span>
              <br></br> Images Count
            </li>
            <li className="grid-item">
              <span className="custom-text">{result.meta.images_size} KB</span>
              <br></br> Images Size
            </li>
            <li className="grid-item">
              <span className="custom-text">{result.meta.scripts_count}</span>
              <br></br> Scripts Count
            </li>
            <li className="grid-item">
              <span className="custom-text">{result.meta.scripts_size} KB</span>
              <br></br> Scripts Size
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.meta.stylesheets_count}
              </span>
              <br></br> Stylesheets Count
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.meta.stylesheets_size} KB
              </span>
              <br></br> Stylesheets Size
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.meta.cumulative_layout_shift.toFixed(5)}
              </span>
              <br></br> Cumulative Layout Shift
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.meta.render_blocking_scripts_count}
              </span>
              <br></br> Render Blocking Scripts
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.meta.render_blocking_stylesheets_count}
              </span>
              <br></br> Render Blocking Stylesheets
            </li>
          </ul>
          <h3 className="section-heading" style={{ fontSize: "30px" }}>
            Content
          </h3>
          <ul
            className="instant_pages_meta_content score_table grid-container"
            
          >
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.time_to_interactive} ms
              </span>
              <br></br> Time to Interactive
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.dom_complete} ms
              </span>
              <br></br> DOM Complete
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.largest_contentful_paint.toFixed(3)} ms
              </span>
              <br></br> Largest Contentful Paint
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.first_input_delay.toFixed(3)} ms
              </span>
              <br></br> First Input Delay
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.connection_time.toFixed(3)} ms
              </span>
              <br></br> Connection Time
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.time_to_secure_connection.toFixed(3)} ms
              </span>
              <br></br> Time to Secure Connection
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.waiting_time} ms
              </span>
              <br></br> Waiting Time
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.download_time} ms
              </span>
              <br></br> Download Time
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.duration_time} ms
              </span>
              <br></br> Duration Time
            </li>
          </ul>
          <h3 className="section-heading" style={{ fontSize: "30px" }}>
            Page Timing
          </h3>
          <ul className="instant_pages_meta_content score_table grid-container">
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.time_to_interactive} ms
              </span>
              <br></br> Time to Interactive
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.dom_complete} ms
              </span>
              <br></br> DOM Complete
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.largest_contentful_paint} ms
              </span>
              <br></br> Largest Contentful Paint
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.first_input_delay} ms
              </span>
              <br></br> First Input Delay
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.connection_time} ms
              </span>
              <br></br> Connection Time
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.time_to_secure_connection} ms
              </span>
              <br></br> Time to Secure Connection
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.waiting_time} ms
              </span>
              <br></br> Waiting Time
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.download_time} ms
              </span>
              <br></br> Download Time
            </li>
            <li className="grid-item">
              <span className="custom-text">
                {result.page_timing.duration_time} ms
              </span>
              <br></br> Duration Time
            </li>
          </ul>
          <h3 className="section-heading" style={{ fontSize: "30px" }}>
            Overall
          </h3>
          <ul className="instant_pages_duplicates score_table grid-container">
            <li className="grid-item">
              {result.broken_resources ? (
                <span className="custom-text">{result.broken_resources}</span>
              ) : (
                <span className="custom-text red-text">X</span>
              )}
              <br></br> Broken Resources
            </li>
            <li className="grid-item">
              {result.broken_links ? (
                <span className="custom-text">{result.broken_links}</span>
              ) : (
                <span className="custom-text red-text">X</span>
              )}
              <br></br> Broken Links
            </li>
            <li className="grid-item">
              {result.duplicate_title ? (
                <span className="custom-text">{result.duplicate_title}</span>
              ) : (
                <span className="custom-text red-text">X</span>
              )}
              <br></br> Duplicate Title
            </li>
            <li className="grid-item">
              {result.duplicate_description ? (
                <span className="custom-text">
                  {result.duplicate_description}
                </span>
              ) : (
                <span className="custom-text red-text">X</span>
              )}
              <br></br> Duplicate Description
            </li>
            <li className="grid-item">
              {result.duplicate_content ? (
                <span className="custom-text">{result.duplicate_content}</span>
              ) : (
                <span className="custom-text red-text">X</span>
              )}
              <br></br> Duplicate Content
            </li>
            <li className="grid-item">
              {result.click_depth ? (
                <span className="custom-text">{result.click_depth}</span>
              ) : (
                <span className="custom-text red-text">X</span>
              )}
              <br></br> Click Depth
            </li>

            <li className="grid-item">
              <span className="custom-text">{result.size} KB</span>
              <br></br> Size
            </li>
            <li className="grid-item">
              <span className="custom-text">{result.encoded_size} KB</span>
              <br></br> Encoded Size
            </li>
            <li className="grid-item">
              {result.fetch_time ? (
                <span className="custom-text">
                  {new Date(result.fetch_time).toLocaleTimeString()}
                </span>
              ) : (
                <span className="custom-text">✗</span>
              )}
              <br></br> Fetch Time
            </li>

            <li className="grid-item">
              <span className="custom-text">
                {result.total_transfer_size} KB
              </span>
              <br></br> Total Transfer Size
            </li>
            <li className="grid-item">
              <span className="custom-text">{result.content_encoding}</span>
              <br></br> Content Encoding
            </li>
          </ul>

          <h2 className="section-heading" style={{ fontSize: "30px" }}>
            Page Checks
          </h2>
          <ul className="grid-container">
            {Object.entries(result.checks).map(([key, value]) => (
              <li className="grid-item" key={key}>
                {typeof value === "boolean" ? (
                  <span
                    className={`custom-text-checks ${value ? "green" : "red"}`}
                  >
                    {value ? "✔" : "X"}
                  </span>
                ) : (
                  <span className="custom-text">
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                )}
                <br></br>{" "}
                {key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DataForSEOWidget;