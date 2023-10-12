import React from "react";
//import { Whitepaper } from "./Whitepaper";
//import {Test } from "./Test";
//import {Lang } from "./Lang";

//export function Main({ dappjs,connectWallet,selectedAddress,scrollToAnchor,handlePdfLink }) {
export function Main({ dappjs, t }) {
  return (
    // If everything is loaded, we render the application.

    <div className="content">
      <div className="header">
        <div className="left">
          <div className="title">
            <div id="web_logo">
              <img src="maxdex.png"></img>
            </div>
            {/*<div id="web_title">MaxDex</div>*/}
          </div>
          {/* <div className="subtitle">{t('1')}</div>*/}
        </div>

        <div className="right">
          <div id="select_lang">
            <select
              id="select_lang_opt"
              onChange={() => dappjs._changeLanguage()}
            >
              <option value="en">English</option>
              <option value="zh">简体中文</option>
            </select>
          </div>
        </div>
      </div>

      <div className="menu_area">
        <div className="menu">
          <div
            className="menu_sub"
            onClick={() => dappjs._scrollToAnchor("presale")}
          >
            {t("2")}
          </div>
          <div
            className="menu_sub"
            onClick={() => dappjs._scrollToAnchor("describe")}
          >
            {t("3")}
          </div>

          <div
            className="menu_sub"
            onClick={() => dappjs._scrollToAnchor("tokenomics")}
          >
            {t("4")}
          </div>

          <div
            className="menu_sub"
            onClick={() => dappjs._scrollToAnchor("whitepaper")}
          >
            {t("5")}
          </div>

          <div
            className="menu_sub"
            onClick={() => dappjs._scrollToAnchor("roadmap")}
          >
            {t("6")}
          </div>

          <div
            className="menu_sub"
            onClick={() => dappjs._scrollToAnchor("ourteam")}
          >
            {t("7")}
          </div>

          {/*
          <div
            className="menu_sub"
            onClick={() => dappjs._scrollToAnchor("launchapp")}
          >
            {t("8")}
          </div>

  */}
        </div>
      </div>

      <div id="wallet_alert">{t("9")}</div>

      <div className="presale" id="presale">
        <div id="presale_top">
          <div className="presale_left">
            <div className="saletitle">{t("10")}</div>
            <div className="saletitle2">{t("11")}</div>
            <div className="saletitle">{t("12")}</div>

            <div className="saledetail">
              &nbsp;&nbsp; &nbsp;&nbsp;{t("13")}
              <br />
              &nbsp;&nbsp; &nbsp;&nbsp;{t("14")}
            </div>
            {/*
            <div id="link_howtobuy">
              <a href="#" onClick={() => dappjs._showHowtobuyWnd()}>
                {t("29")}
              </a>
            </div>
  */}

            <div
              id="link_howtobuy"
              onClick={() => dappjs._scrollToAnchor("howbuy")}
            >
              {t("29")}
            </div>
          </div>

          <div className="presale_right">
            <div className="salebox">
              <div className="sale_info">
                <div className="sale_info_detail">
                  {/*  <p className="l_title"></p>*/}

                  <div className="countdown_time" id="countdown_time">
                    <div id="ct_title">{t("151")}</div>
                    <div>
                      <span id="time_days"></span>
                      <span className="sub_small">{t("152")}</span>
                      <span id="time_hours"></span>
                      <span className="sub_small">{t("153")}</span>
                      <span id="time_minutes"></span>
                      <span className="sub_small">{t("154")}</span>
                      <span id="time_seconds"></span>
                      <span className="sub_small">{t("155")}</span>
                    </div>
                  </div>

                  {/*   <p><span className="l_left">{t('16')}</span> <span className="l_right">1,000,000,000</span></p>
                  <p><span className="l_left">{t('17')} </span> <span className="l_right">200,000,000</span></p>

*/}

                  <p>
                    <span className="l_left">{t("22")} </span>{" "}
                    <span className="l_right" id="current_price">
                      {" "}
                      --
                    </span>
                  </p>
                  <p>
                    <span className="l_left">{t("23")} </span>{" "}
                    <span className="l_right" id="next_price">
                      --
                    </span>
                  </p>
                  {/*  
                  <p>
                    <span className="l_left">{t("18")} </span>{" "}
                    <span className="l_right" id="amount_sold">
                      --
                    </span>
                  </p>
*/}
                  <p>
                    <span className="l_left">{t("20")} </span>{" "}
                    <span className="l_right" id="fund_raised">
                      --
                    </span>
                  </p>
                  {/*     <p id="user_ownd_amt"><span className="l_left">{t('24')}  </span> <span className="l_right" id="user_amt">--</span></p>*/}
                </div>

                <div className="input_amt">
                  <input id="TokenAmt" type="number" placeholder={""} />
                </div>

                <div className="btn_group">
                  <input
                    id="BtnUSDTBuy"
                    className="btn"
                    type="button"
                    value={t("26")}
                    onClick={() => dappjs._buyWithUSDT()}
                  ></input>
                  <input
                    id="BtnETHBuy"
                    className="btn"
                    type="button"
                    value={t("27")}
                    onClick={() => dappjs._buyWithETH()}
                  ></input>

                  <input
                    id="BtnClaim"
                    className="btn"
                    type="button"
                    value={t("28")}
                    onClick={() => dappjs._claimMXDXTokens()}
                  ></input>
                </div>

                {/*
                <div className="wallet">
                  {dappjs.state.selectedAddress ? (
                    <div
                      id="user_address"
                      title={dappjs.state.selectedAddress}
                    ></div>
                  ) : (
                    <input
                      className="btn"
                      type="button"
                      value={t("156")}
                      onClick={() => dappjs._connectWallet()}
                    ></input>
                  )}
                </div>
                  */}

                {dappjs.state.selectedAddress ? (
                  <div id="user_ownd_amt">
                    <span className="l_left">{t("24")} </span>
                    <span className="l_right" id="user_amt">
                      0
                    </span>
                  </div>
                ) : (
                  <div className="wallet">
                    <input
                      className="btn"
                      type="button"
                      value={t("156")}
                      onClick={() => dappjs._connectWallet()}
                    ></input>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 
        <div className="stage_box">

          <div className="stage_box_line">

            <div className="one_box">
              <div className="box_name">{t('30')} 1</div>
              <div className="box_cont">
                <p><span className="box_left">{t('31')}:</span><span className="box_right">15,000,000</span></p>
                <p><span className="box_left">{t('32')}:</span><span className="box_right">0.01USDT</span></p>
              </div>
            </div>

            <div className="one_box">
              <div className="box_name">{t('30')} 2</div>
              <div className="box_cont">
                <p><span className="box_left">{t('31')}:</span><span className="box_right">15,000,000</span></p>
                <p><span className="box_left">Price:</span><span className="box_right">0.02USDT</span></p>
              </div>
            </div>

            <div className="one_box">
              <div className="box_name">{t('30')} 3</div>
              <div className="box_cont">
                <p><span className="box_left">{t('31')}:</span><span className="box_right">20,000,000</span></p>
                <p><span className="box_left">{t('32')}:</span><span className="box_right">0.04USDT</span></p>
              </div>
            </div>

            <div className="one_box">
              <div className="box_name">{t('30')} 4</div>
              <div className="box_cont">
                <p><span className="box_left">{t('31')}:</span><span className="box_right">20,000,000</span></p>
                <p><span className="box_left">{t('32')}:</span><span className="box_right">0.08USDT</span></p>
              </div>
            </div>

            <div className="one_box">
              <div className="box_name">{t('30')} 5</div>
              <div className="box_cont">
                <p><span className="box_left">{t('31')}:</span><span className="box_right">20,000,000</span></p>
                <p><span className="box_left">{t('32')}:</span><span className="box_right">0.20USDT</span></p>
              </div>
            </div>
          </div>
          <div className="stage_box_line">

            <div className="one_box">
              <div className="box_name">{t('30')} 6</div>
              <div className="box_cont">
                <p><span className="box_left">{t('31')}:</span><span className="box_right">20,000,000</span></p>
                <p><span className="box_left">{t('32')}:</span><span className="box_right">0.30USDT</span></p>
              </div>
            </div>

            <div className="one_box">
              <div className="box_name">{t('30')} 7</div>
              <div className="box_cont">
                <p><span className="box_left">{t('31')}:</span><span className="box_right">20,000,000</span></p>
                <p><span className="box_left">{t('32')}:</span><span className="box_right">0.40USDT</span></p>
              </div>
            </div>

            <div className="one_box">
              <div className="box_name">{t('30')} 8</div>
              <div className="box_cont">
                <p><span className="box_left">{t('31')}:</span><span className="box_right">20,000,000</span></p>
                <p><span className="box_left">{t('32')}:</span><span className="box_right">0.50USDT</span></p>
              </div>
            </div>

            <div className="one_box">
              <div className="box_name">{t('30')} 9</div>
              <div className="box_cont">
                <p><span className="box_left">{t('31')}:</span><span className="box_right">25,000,000</span></p>
                <p><span className="box_left">{t('32')}:</span><span className="box_right">0.60USDT</span></p>
              </div>
            </div>

            <div className="one_box">
              <div className="box_name">{t('30')} 10</div>
              <div className="box_cont">
                <p><span className="box_left">{t('31')}:</span><span className="box_right">25,000,000</span></p>
                <p><span className="box_left">{t('32')}:</span><span className="box_right">0.80USDT</span></p>
              </div>
            </div>
          </div>

        </div>
*/}
      </div>

      <div id="describe">
        <div id="des_title">{t("33")}</div>

        <div id="des_cont">
          &nbsp;&nbsp; &nbsp;&nbsp;{t("34")}
          <br />
          &nbsp;&nbsp; &nbsp;&nbsp;{t("35")}
          <br />
          &nbsp;&nbsp; &nbsp;&nbsp;{t("36")}
          <br />
          &nbsp;&nbsp; &nbsp;&nbsp; {t("37")}
          <br />
          &nbsp;&nbsp; &nbsp;&nbsp; {t("38")}
          <br />
          &nbsp;&nbsp; &nbsp;&nbsp; {t("39")}
        </div>

        <div id="des_img">
          <div className="left">
            <img src="exchange.png"></img>
          </div>
          <div className="middle">
            <img src="ex_arrow.png"></img>
          </div>
          <div className="right">
            <img src="ex_maxdex.png"></img>
          </div>
        </div>

        <div id="des_feature">
          <div className="left">
            <div>
              <span className="dot">
                <img src="dot.png"></img>
              </span>
              <span className="text">{t("165")}</span>
            </div>
            <div>
              <span className="dot">
                <img src="dot.png"></img>
              </span>
              <span className="text">{t("166")}</span>
            </div>
            <div>
              <span className="dot">
                <img src="dot.png"></img>
              </span>
              <span className="text">{t("169")}</span>
            </div>
          </div>
          <div className="middle"></div>
          <div className="right">
            <div>
              <span className="dot">
                <img src="dot.png"></img>
              </span>
              <span className="text">{t("167")}</span>
            </div>
            <div>
              <span className="dot">
                <img src="dot.png"></img>
              </span>
              <span className="text">{t("168")}</span>
            </div>
            <div>
              <span className="dot">
                <img src="dot.png"></img>
              </span>
              <span className="text">{t("170")}</span>
            </div>
          </div>
        </div>

        <div className="yt_video">
          <iframe
            id="ytplayer"
            src="https://www.youtube.com/embed/9OvkMNeK5e4?si=VJngf5uQRDjYPT0K"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <div id="tokenomics">
        <div id="tokenomics_title">{t("48")}</div>

        <div id="tokenomics_cont">
          &nbsp;&nbsp;&nbsp;&nbsp;{t("49")}
          <br />
          <br />
          <br />
        </div>
        <div id="token_img">
          {" "}
          <img src="token1.png"></img> <img src="token2.png"></img>{" "}
          <img src="token3.png"></img>
        </div>
      </div>

      {/*
      <div id="tokenomics">
        <div id="tokenomics_title">{t("162")}</div>

        <div id="tokenomics_cont">
          &nbsp;&nbsp;&nbsp;&nbsp;{t("49")}
          <br />
          <br />
        
        </div>

       

      
      </div>

*/}

      <div id="whitepaper">
        <div className="whitepaper_title">{t("62")}</div>

        <div className="whitepaper_detail">
          <div className="whitepaper_left">
            <div className="whitepaper_cont">
              {t("63")}
              <br />
              {t("64")}

              <br />
              {t("65")}
              <br />
              {t("66")}
              <br />
            </div>

            <div className="whitepaper_download">
              <input
                className="btn"
                type="button"
                value={t("67")}
                onClick={() => {
                  const w = window.open("about:blank");
                  w.location.href = dappjs._getWhitepaperName();
                }}
              ></input>
              {/*   <input id="btn_download" className="btn" type="button" value={t('68')} onClick={() => dappjs._handlePdfLink()}></input>*/}
            </div>
          </div>

          <div className="whitepaper_img">
            <img src="download.jpg"></img>
          </div>
        </div>
      </div>

      <div id="roadmap">
        <div id="map_title">{t("69")}</div>

        <div id="mapstages">
          <div className="line1">
            <div className="circle_box">
              <div className="circle left">
                <div className="stagetime">{t("70")}</div>

                <div className="stagecontent">
                  {t("71")}
                  <br />

                  {t("73")}
                </div>
              </div>
            </div>

            <div className="circle_box second">
              <div className="circle left">
                <div className="stagetime">{t("80")}</div>

                <div className="stagecontent">
                  {t("82")}
                  <br />

                  {t("83")}
                  <br />
                  {t("85")}
                  <br />
                </div>
              </div>
            </div>

            <div className="circle_box third">
              <div className="circle left">
                <div className="stagetime">{t("91")}</div>

                <div className="stagecontent">
                  {t("92")}
                  <br />
                  {t("93")}
                  <br />
                  {t("94")}
                </div>
              </div>
            </div>
          </div>

          <div className="line2">
            <img src="roadmap.png"></img>
          </div>

          <div className="line3">
            <div className="circle_box second">
              <div className="circle right">
                <div className="stagetime">{t("74")}</div>

                <div className="stagecontent">
                  {t("76")}
                  <br />

                  {t("77")}
                  <br />
                  {t("78")}
                  <br />
                </div>
              </div>
            </div>

            <div className="circle_box  third">
              <div className="circle right">
                <div className="stagetime">{t("86")}</div>

                <div className="stagecontent">
                  {t("87")}
                  <br />
                  {t("88")}
                  <br />

                  {t("90")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="ourteam">
        <div id="team_title">{t("103")}</div>

        {/*
        <div id="team_img">
          <img src="R-C.jpg"></img>
        </div>
        */}
        <div id="teamcont">&nbsp;&nbsp; &nbsp;&nbsp;{t("164")}</div>
        <div className="team_mems">
          <div className="team_mem">
            <div id="team_avatar">
              <img src="tl.webp"></img>
            </div>
            <div id="team_profile">
              <div id="team_name">{t("157")}</div>
              <div id="team_positions">
                {/* <span className="team_position">{t("158")}</span> */}
                <span className="team_position">{t("159")}</span>
                <span className="team_position">{t("160")}</span>
              </div>
            </div>
          </div>

          <div className="team_mem_des">{t("161")}</div>
        </div>
      </div>

      <div id="howbuy">
        <div id="howbuy_title">{t("29")}</div>
        <div id="howbuy_cont">
          <div>
            <img src="arrow.png"></img>&nbsp;&nbsp;{t("110")}
          </div>
          <div>
            <img src="arrow.png"></img>&nbsp;&nbsp;{t("111")}
          </div>
          <div>
            <img src="arrow.png"></img>&nbsp;&nbsp;{t("112")}
          </div>
          <div>
            <img src="arrow.png"></img>&nbsp;&nbsp;{t("113")}
          </div>
          <div>
            <img src="arrow.png"></img>&nbsp;&nbsp;{t("114")}
          </div>
          {/* <div><img src="arrow.png"></img>&nbsp;&nbsp;{t("115")}</div> */}
          <div>
            <img src="arrow.png"></img>&nbsp;&nbsp;{t("116")}
          </div>
          <div>
            <img src="arrow.png"></img>&nbsp;&nbsp;{t("117")}
          </div>
        </div>
      </div>

      <div id="powered">
        <div id="powered_title">Powered By</div>
        <div id="powered_cont">
          <img src="logo-eth-ss.png"></img>

          {/*
          <img src="logo-bnb-ss.png"></img>

          <img src="solana.jpg"></img>
          <img src="polygon.png"></img>
        */}
          <img src="logo-metamask-ss.png"></img>
        </div>
      </div>

      <div className="footer">
        <div className="navi">
          <div className="navi_sub left">
            <a onClick={() => dappjs._scrollToAnchor("presale")}>{t("2")}</a>
          </div>

          <div className="navi_sub right">
            <a onClick={() => dappjs._scrollToAnchor("describe")}>{t("3")}</a>
          </div>

          <div className="navi_sub left">
            <a onClick={() => dappjs._scrollToAnchor("tokenomics")}>{t("4")}</a>
          </div>

          <div className="navi_sub right">
            <a onClick={() => dappjs._scrollToAnchor("whitepaper")}>{t("5")}</a>
          </div>

          <div className="navi_sub left">
            <a onClick={() => dappjs._scrollToAnchor("roadmap")}>{t("6")}</a>
          </div>

          <div className="navi_sub right">
            <a onClick={() => dappjs._scrollToAnchor("ourteam")}>{t("7")}</a>
          </div>

          {/*
          <div
            className="navi_sub left"
            onClick={() => dappjs._scrollToAnchor("launchapp")}
          >
            {t("8")}
          </div>
      */}
        </div>

        <div className="links">
        <a
            className="adjust_img"
            href="https://t.me/maxdexapp"
            target="_blank"
          >
             <img src="telegram.png"></img>
          </a>
          <a
            className="adjust_img"
            href="https://twitter.com/maxdexdapp"
            target="_blank"
          >
            <img src="twitter.png"></img>
          </a>
          <a href="https://github.com/MaxDexdApp" target="_blank">
            <img src="github.png"></img>
          </a>
          <a href="https://www.youtube.com/watch?v=9OvkMNeK5e4" target="_blank">
            <img src="youtube.png"></img>
          </a>

          {/*
          <a href="https://discord.gg/wXVgRrAasW" target="_blank"><img src="Discord2.svg"  ></img></a>
          <a href="https://www.reddit.com/r/MaxDexApp/" target="_blank"><img src="reddit.png"  ></img></a>
          <a href="https://www.facebook.com/profile.php?id=100089628746972" target="_blank"><img src="facebook.png"  ></img></a>
        */}
        </div>

        <div className="copyright">
          <p> {t("105")}: service@maxdex.app</p>
          <p>
            {" "}
            {t("106")} © 2023 - MaxDex Finance. {t("107")}
          </p>
        </div>
      </div>
      {/*
          <div className="row">
            <div className="col-12">
              <h1>
                {this.state.tokenData.name} ({this.state.tokenData.symbol})
              </h1>
              <p>
                Welcome <b>{this.state.selectedAddress}</b>, you have{" "}
                <b>
                  {this.state.balance.toString()} {this.state.tokenData.symbol}
                </b>
                .
              </p>
            </div>
          </div>
      
          <hr />
  
          <div className="row">
            <div className="col-12">
             
              {this.state.txBeingSent && (
                <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
              )}
  
             
              {this.state.transactionError && (
                <TransactionErrorMessage
                  message={this._getRpcErrorMessage(this.state.transactionError)}
                  dismiss={() => this._dismissTransactionError()}
                />
              )}
            </div>
          </div>
  
             
  
          <div className="row">
            <div className="col-12">
             
              {this.state.balance.eq(0) && (
                <NoTokensMessage selectedAddress={this.state.selectedAddress} />
              )}
  
             
              {this.state.balance.gt(0) && (
                <Transfer
                  transferTokens={(to, amount) =>
                    this._transferTokens(to, amount)
                  }
                  tokenSymbol={this.state.tokenData.symbol}
                />
              )}
            </div>
          </div>
   */}

      <div className="pop_box" id="pop_box_msg">
        <div className="pop_box_wnd" id="pop_box_wnd_msg">
          <div className="pop_title" id="pop_title">
            <img
              id="btn_pop_close"
              src="close.png"
              onClick={() => dappjs._closePopWndMsg()}
            ></img>
          </div>
          <div className="pop_msg" id="pop_msg_cont"></div>

          <div className="pop_btn" id="pop_btn_approve">
            <input
              id="BtnApprove"
              className="btn"
              type="button"
              value={t("108")}
              onClick={() => dappjs._approveTokens()}
            ></input>
          </div>
        </div>
      </div>

      <div className="pop_box" id="pop_box_buy">
        <div className="pop_box_wnd" id="pop_box_wnd_msg">
          <div className="pop_title" id="pop_buy_title">
            {t("109")}
          </div>
          <div className="pop_msg" id="pop_msg_cont">
            <div>1.&nbsp;{t("110")}</div>
            <div>2.&nbsp;{t("111")}</div>
            <div>3.&nbsp;{t("112")}</div>
            <div>4.&nbsp;{t("113")}</div>
            <div>5.&nbsp;{t("114")}</div>
            <div>6.&nbsp;{t("115")}</div>
            <div>7.&nbsp;{t("116")}</div>
            <div>8.&nbsp;{t("117")}</div>
          </div>

          <div className="pop_btn">
            <input
              className="btn"
              type="button"
              value={t("118")}
              onClick={() => dappjs._closeHowtobuyWnd()}
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
}
