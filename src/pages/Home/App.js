import VLibras from "@djpfs/react-vlibras";

function App(){
    return(
        <div className="App">
            <VLibras forceOnload={true} />
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"></img>
            </header>
        </div>
    );
}
export default App;