import './App.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from './firebase.init';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';




const auth = getAuth(app);

function App() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  // const [errorSmall, setErrorSmall] = useState('');
  const [register, setRegister] = useState(false);

  const handleEmailBlur = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordBlur = (event) => {
    setPassword(event.target.value)
  }


  const handleRegisterChange = (event) => {

    setRegister(event.target.checked)

  }

  const handleNameBlur = (event) => {
    setName(event.target.value)
  }

  const formSubmit = (event) => {

    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {

      event.stopPropagation();
    }


    setValidated(true);
    setError('');


    if (register) {

      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user)


        })

        .catch((error) => {
          console.log(error)
        })

    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user)
          setEmail('');
          setPassword('');
          verifyEmail();
          createName();
        })

        .catch((error) => {
          setError(error.message)

          console.error(error);
        })



    }




    event.preventDefault()
  }


  const createName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(() => {

        console.log('updating Name')

      })
      .catch((error) => {

        setError(error.message)

      })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Email verify link send.')
      })
  }

  const sendResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Reset email sent!')
      })
      .catch((error) => {
        setError(error)
      })
  }

  console.log(name)


  return (
    <div>

      <div className='resgistration w-50 mx-auto'>
        <h1 className='text-primary mt-3'>Please {register ? 'Login !!' : 'Register'}</h1>
        <Form noValidate validated={validated} onSubmit={formSubmit}>


          {!register && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Your Name</Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter Your Name" required />
            <Form.Control.Feedback type="invalid">
              Please please enter your name.
            </Form.Control.Feedback>

          </Form.Group>
          }


          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Control.Feedback type="invalid">
              Please please enter valid email address.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check onChange={handleRegisterChange} type="checkbox" label="Already register" />
            </Form.Group>
            <Form.Control.Feedback type="invalid">
              Please enter a valid password
            </Form.Control.Feedback>
            <p className='text-danger'>{error}</p>
          </Form.Group>

          <button onClick={sendResetPassword} variant='link'>Forget password</button>

          <Button variant="primary" type="submit">
            {register ? 'Login' : 'Submit'}
          </Button>
        </Form>
      </div>

    </div>
  );
}

export default App;
