import { useEffect, useState } from 'react';
import './App.css';
import { Flatfile } from '@flatfile/sdk';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function App() {
  let [csvData, setCsvData] = useState([]);
  let [tmpCsv, setTmpCsv] = useState([]);
  const importfile = () => {
    console.log("file imported")
    Flatfile.requestDataFromUser({
      embedId: '',
      onData: async (chunks, next) => {
        console.log("chunks ====>> ", chunks)
        for (let i = 0; i < chunks.records.length; i++) {
          setCsvData(oldData => [...oldData, chunks.records[i].data])
          setTmpCsv(oldData => [...oldData, chunks.records[i].data])
        }
        next()
      },
      onError: (err) => {
        console.log("error occurred while uploading ", err);
      },
      onComplete: () => {
        console.log("inside onComplete ",)
      }
    })
  }
  const columnDefs = [
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'age' }
  ];

  const rowData = csvData;


  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tmpCsv })
    };
    const fetchData = async () => {
      try {
        await fetch('url', requestOptions)
          .then(response => response.json())
          .then(data => {
            setTmpCsv([]);
            console.log("data ", data)
          });
      } catch (err) {
        console.log("something went wrong ", err)
      }
    }
    fetchData();

  }, [tmpCsv])
  return (
    <div className="App">
      <div className='header-container'>
        <div className='myHeader'>
          <p className='heading'>Import your flat files</p>
          <div className='myBtn'>
            <button className='btnStyle' onClick={importfile}>Import Files</button>
          </div>
        </div>
      </div>
      <div className='csvTable-conatiner'>
        <div className='csvTable'>
          <p className='heading'>Uploaded CSV</p>
          <div className="ag-theme-alpine" style={{ width: 500, height: 500 }}>
            <AgGridReact
              rowData={rowData} columnDefs={columnDefs}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
