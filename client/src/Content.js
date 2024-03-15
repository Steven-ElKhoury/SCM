import React,{useState} from 'react'
import Axios from 'axios'

const Content = () => {
  const [bookName, setBookName] = useState('');
  const [publisher, setPublisher] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleBookNameChange = (event) => {
    const newName = event.target.value;
    setBookName(newName);
    setIsSubmitDisabled(!newName || !publisher);
  };

  const handlePublisherChange = (event) => {
    const newPublisher = event.target.value;
    setPublisher(newPublisher);
    setIsSubmitDisabled(!bookName || !newPublisher);
  };

  const handleSubmit = () => {
    // Perform submission logic here
    console.log('Book Name:', bookName);
    console.log('Publisher:', publisher);
    
    // Reset form or navigate to another page if needed
    setBookName('');
    setPublisher('');

  };


  var book_id = '1'
    const print_info = () => {
        Axios.get('http://localhost:3001/gettinglibrary').then((response) => {
            //setProductsList(response.data) 
            console.log("HI")
        })
        
    }

    const getAddress = ()=>{
      Axios.post('http://localhost:3001/getpublisheraddress',{Book_ID:book_id}).then((response)=>{
        console.log('my addressid: '+response.data);
        
        //setaddress2(response.data[0]['address_id']);
        //console.log('tnen tnen tnen'+ address2);
      })
    }


    return (
      <>
        Hello
      <br/>
        <button
                type='button'
                onClick={() => {
                  print_info()
                }}
              >
                Print it out
        </button>
        <br/>
        <button
                type='button'
                onClick={() => {
                  getAddress()
                }}
              >
               Get Book's publisher address
        </button>

      <br/>
      <label>
        Book Name:
        <input type="text" value={bookName} onChange={handleBookNameChange} />
      </label>
      <br />
      <label>
        Publisher:
        <input type="text" value={publisher} onChange={handlePublisherChange} />
      </label>
      <br />
      <button onClick={handleSubmit} disabled={isSubmitDisabled}>
        Submit
      </button>

    </>
  )
}

export default Content