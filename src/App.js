import React, {useState} from 'react';
import logo from './ufo.svg';
import {Form, Button, Image, Container, InputGroup, Row, Col, Spinner, Alert} from 'react-bootstrap';
import axios from 'axios';
import qs from 'qs';

function App() {
  const [departure, setDeparture] = useState('');
  const [destinations, setDestinations] = useState(['']);
  const [result, setResult] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setLoad] = useState(false);

  const addDestination = () => {
    setDestinations([...destinations, ''])
  };

  const removeDestination = (e) => {
    const updatedDestinations = [...destinations];
    updatedDestinations.splice(e.target.dataset.idx, 1);
    setDestinations(updatedDestinations);
  };

  const handleDepartureChange = (e) => {
    setDeparture(e.target.value);
  };

  const handleDestinationChange = (e) => {
    const updatedDestinations = [...destinations];
    updatedDestinations[e.target.dataset.idx] = e.target.value;
    setDestinations(updatedDestinations);
  };

  const findFlight = async (e) => {
    e.preventDefault();

    setLoad(true);

    const response = await axios.get('http://localhost:5000/api/optimize', {
      params: {
        from: departure,
        to: destinations
      },
      paramsSerializer: params => {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      }
    });

    setLoad(false);

    if ('message' in response.data) {
      setError(response.data.message)
    } else {
      setResult(response.data)
    }
  };

  return (
    <Container>
      <Row className="justify-content-center m-3">
        <Col className="text-center">
          <h1>Unfair Fligh Optimizer</h1>
          <Image className="w-25" src={logo} alt="logo" fluid/>
        </Col>
      </Row>
      <Form onSubmit={findFlight} className="m-2">
        <Row>
          <Col>
            <Form.Group controlId="departure">
              <Form.Label>Departure</Form.Label>
              <Form.Control required placeholder="City name" onChange={handleDepartureChange}/>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="destinations">
              <Form.Label>Destinations</Form.Label>
              {
                destinations.map((val, idx) => {
                  return (
                      <InputGroup key={idx} className="mb-3">
                        <Form.Control required placeholder="City name" data-idx={idx} onChange={handleDestinationChange}/>
                        <InputGroup.Append>
                          <Button variant="outline-danger"
                                  data-idx={idx}
                                  onClick={removeDestination}
                                  disabled={destinations.length <= 1}
                          >-</Button>
                        </InputGroup.Append>
                      </InputGroup>
                  )
                })
              }
            </Form.Group>
            <Row className="justify-content-center">
              <Button variant="outline-primary" onClick={addDestination}>+</Button>
            </Row>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Button size="lg" disabled={isLoading} type="submit">
            {
              isLoading ? <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
              /> : 'Find'
            }
          </Button>
        </Row>
      </Form>
      <Row className="justify-content-center">
        {
          error && <Alert className="text-center" variant="danger" onClose={() => setError(false)} dismissible>
            <Alert.Heading>{error}</Alert.Heading>
          </Alert>
        }
        {
          result && <Alert className="text-center" variant="success" onClose={() => setResult(false)} dismissible>
            <Alert.Heading>
              You should go to {result.destination}. It will cost you only {result.dpk} $/km
            </Alert.Heading>
          </Alert>
        }
      </Row>
    </Container>
  );
}

export default App;