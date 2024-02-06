import React, { useState, useEffect } from 'react';
import "./App.css";
import io from 'socket.io-client';
import ProgressBar from "@ramonak/react-progress-bar";
import Navbar from './Navbar';
//import "@ramonak/react-progress-bar/dist/index.css";



const socket = io.connect('http://127.0.0.1:5000');

const App = () => {
    const [error, setError] = useState(null);
    const [newfilecount, setnewfilecount] = useState(0);
    const [oldfilecount, setoldfilecount] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [dublicateCount, setdublicateCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [no_files, setno_files] = useState(0);
    const [seletedfile, setseletedfile] = useState(null)
    const [progress, setprogress] = useState(0)
    const [pdffiles, setpdffiles] = useState(0)
    const [docxfiles, setdocxfiles] = useState(0)
    const [docfiles, setdocfiles] = useState(0)
    const [rtffiles, setrtffiles] = useState(0)
    const [txtfiles, settxtfiles] = useState(0)

    useEffect(() => {
        let a = 0;
        socket.on('progress_update', data => {
            setCurrentCount(data.current_count);
            setTotalCount(data.total_count);
            setnewfilecount(data.new_count);
            setoldfilecount(data.old_count);
            setdublicateCount(data.dublicate_count)
            setprogress(Math.round((data.current_count/data.total_count)*100))
        });
        socket.on('parse_complete', data => {
            // Handle completion if needed
        });

        return () => {
            socket.off('progress_update');
            socket.off('parse_complete');
        };
    }, [currentCount, totalCount]);

    const handleParseResume = async (e) => {
        e.preventDefault();

        try {
            const resumeFileInput = document.getElementById('resumeFile');
            const resumeFiles = resumeFileInput.files;
            setno_files(resumeFiles.length);

            const formData = new FormData();
            for (let i = 0; i < resumeFiles.length; i++) {
                formData.append('resumes[]', resumeFiles[i]);
            }
            formData.append('isFolderUpload', true);

            const response = await fetch('http://127.0.0.1:5000/resumeparse', {
                method: 'POST',
                body: formData,
                mode: 'cors',
            });

            if (response.ok) {
                // Handle successful response if needed
            } else {
                setError('Failed to parse resume');
            }
        } catch (error) {
            console.error('Error parsing resume:', error);
            setError('An error occurred while parsing the resume');
        }
    };

    const handlechange = (e) =>{
        const files = e.target.files;
        setseletedfile(files)
        const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
        const numberOfPdfFiles = pdfFiles.length;
        setpdffiles(numberOfPdfFiles)
        const docxfiles = Array.from(files).filter(file => file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        const numberOfdocxFiles = docxfiles.length;
        setdocxfiles(numberOfdocxFiles)
        const docfiles = Array.from(files).filter(file => file.type === 'application/msword');
        const numberOfdocFiles = docfiles.length;
        setdocfiles(numberOfdocFiles)
        const rtffiles = Array.from(files).filter(file => file.type === 'application/rtf');
        const numberOfrtfFiles = rtffiles.length;
        setrtffiles(numberOfrtfFiles)
        const txtfiles = Array.from(files).filter(file => file.type === 'text/plain');
        const numberOftxtFiles = txtfiles.length;
        settxtfiles(numberOftxtFiles)

    }
    const handleClick = () => {
        window.location.reload();
      };
        

    return (

      <div>
        <div>
          <Navbar/>
        </div>
        <div className='nav-bar'>
          <div className='nav-div'>
                <div className='upload-main'>
                    <div className='upload-main-div'>
                    <div className='upload-resume'>
                        <div>
                        <div>
                             <img src='https://truetalent.io/Assets/svgs/upload.svg' />
                             <input type="file" id="resumeFile" name="files[]" accept=".pdf,.doc,.docx,.rtf,.txt" directory="" webkitdirectory="" onChange={handlechange} multiple required 
                             style={{color : seletedfile ? "#14BC9A" : "white"}}>
                                </input>
                           
                        </div>
                        
                        </div>
                    </div>
                    <div className='upload-buut-div'>
                        <button type="submit" className='upload-button' onClick={handleParseResume}>Parse Folder</button>
                    </div>
                    </div>
                    <div>
                    <div className='tot-div'>
                        <h2 className='tot-txt'>Total No. of Files Uploaded: {no_files}</h2>
                        {no_files == 0 ? <div></div> : <div className='para-div'>
                          <p className='para-txt para-text'>(pdf files: {pdffiles}</p>
                          <p className='para-txt'>doc files: {docfiles}</p>
                          <p className='para-txt'>docx files: {docxfiles}</p>
                          <p className='para-txt'>Rtf files: {rtffiles}</p>
                          <p className='para-txt'>txt files: {txtfiles})</p>
                          </div>}
                    </div>
                    {no_files == 0 ? <div></div> :
                    <div>
                    <ProgressBar completed={progress} 
                    baseBgColor='#efcfcf'
                    bgColor='#14BC9A'
                    height='15px'
                    width='50%'
                    />
                    </div>
                    
                    }
                    
                    <div>
                    <div className="flies-count">
            <p>Number of unique files: {newfilecount}</p>
            <p>Number of files pre-exsist in TT-Database: {oldfilecount}</p>
            <p>Number of dublicate files in this batch: {dublicateCount}</p>
          </div>

          <div className="flies-count">
            <p>
              {
                progress == 100 ? <p>
                   TT Cash eligiblity = {newfilecount * 5}
                </p> : ""
              }
             
            </p>
            <div className="ttcash-button">
            <button className="tt-decline-btn" onClick={handleClick}>Accept</button>
            <button className="tt-accept-btn" onClick={handleClick}>Decline</button>
            </div>
            </div>
                    </div>
                    </div>
                    

                </div>
            </div>
            
        </div>
        </div>

    );
};
export default App;

{/* <div>
            <form onSubmit={handleParseResume}>
                <label htmlFor="resumeFile">Upload Resume:</label>
                <input type="file" id="resumeFile" name="files[]" accept=".pdf,.doc,.docx" directory="" webkitdirectory="" multiple required />
                <button type="submit">Parse Resume</button>
            </form>
            <h1>{no_files} Total Files</h1>
            {error && <div>Error: {error}</div>}
            <div>               
                <h1>{currentCount}/{totalCount} Files processed</h1>
            </div>
            {
                (newfilecount !== 0 || oldfilecount !== 0) ?
                    <div>
                        <div>
                            <h1>{newfilecount} new files, {oldfilecount} old files</h1>
                        </div>
                        <div>
                            <h2>{newfilecount} * 5TT Cash = {newfilecount * 5}TT cash is added to your account</h2>
                        </div>
                    </div> :
                    <div>
                        <h1></h1>
                    </div>
            }
            <div>
                <button>Close</button>
            </div>
        </div> */}
// <div className='nav-container'>
//         <div className='nav-img-div'>
//             <img src='https://truetalent.io/static/media/logo.b9612289.svg' className='nav-img'/>
//         </div>
//         <div className='nav-job'>
//             <div>
//                 <a href=''>Job</a>
//             </div>
//             <div>
//                 <a href=''>Gig</a>
//             </div>
//         </div>
//     </div>