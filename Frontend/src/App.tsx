// Importing the CSS file for styling
import "./App.css";

// Importing the MainPage component from the pages directory
import MainPage from "./pages/MainPage";

// Defining the App component
function App() {
  return (
    <>
      {/* Wrapping the MainPage component inside a div with className "App" */}
      <div className="App">
        <MainPage />
      </div>
    </>
  );
}

// Exporting the App component as the default export
export default App;
