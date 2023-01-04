import { useEffect, useState } from 'react';
import './App.css';
import { Flatfile } from '@flatfile/sdk';

function App() {
  let [csvData, setCsvData] = useState([])
  const importfile = () => {
    console.log("file imported")
    Flatfile.requestDataFromUser({
      embedId: '',
      onData: async (chunks, next) => {
        console.log("chunks ====>> ", chunks)
        for (let i = 0; i < chunks.records.length; i++) {
          setCsvData(oldData => [...oldData, chunks.records[i].data])
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
  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvData })
    };
    if (csvData.length > 0) {
      const fetchData = async () => {
        try {
          await fetch('url', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
        } catch (err) {
          console.log("something went wrong ", err)
        }
      }
      fetchData();
    }

  }, [csvData])
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
      <div className='csvTable'>

      </div>
    </div>
  );
}

export default App;
