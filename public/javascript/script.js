
function websiteState() {
     return window.location.href;
}

function LogoHead() {
     return (
          <a href={websiteState()} clas="nav-link px-2 link-secondary">
               <img src="images/logo.png" />
          </a>      
     )
}
ReactDOM.render(<LogoHead />, document.getElementById("logoHeader"));

function LogoHeadInGame() {
     return (
          <a href={websiteState()} clas="nav-link px-2 link-secondary">
               <img src="../images/logo.png" />
          </a>      
     )
}
ReactDOM.render(<LogoHeadInGame />, document.getElementById("logoHeader"));



function LogoutOption() {
     var username = document.getElementById("username").value;
     return (
          <ul style={{listStyle:"none", marginBottom:"0px"}}>
               <li>
                    <span>Welcome, <span id="loginUser">{username}</span></span>
               </li>
               <li>
                    <a href="/logout">logout</a>
               </li>
          </ul>
     );
}
ReactDOM.render(<LogoutOption />, document.getElementById("logoutOption"));

function PlayAgainDiv() {
     return (
          <div class="popup" style="display:none;">
               <button class="playAgain">Play Again</button>
          </div>
     );
}

ReactDOM.render(<PlayAgainDiv />, document.getElementById("PlayAgainDiv"));
// class HeaderBar extends React.Component {
//      render() {
//           return (
//                <header>
//                     <div class="container">
//                          <div class="row">
//                               <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start col-6 col-md-3 col-sm-4">
//                                    <ul class="nav col-12 col-log-auto me-lg-auto mb-2 justify-center mb-md-0 ">
//                                         <li>
//                                              <LogoHead />
//                                         </li>
//                                    </ul>
//                               </div>
//                               <div id="logoutOption" class="d-flex flex-row-reverse align-items-right justify-content-right col-6 col-md-9 col-sm-8">
//                                    <LogoutOption />
//                               </div>
//                          </div>
//                     </div>
//                </header>
//           )
//      }
// }


// ReactDOM.render(<HeaderBar />, document.getElementById('headbar'));