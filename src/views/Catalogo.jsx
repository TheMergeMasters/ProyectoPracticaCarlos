import { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';

const Catalogo = () => {

  return (
    <Container className="mt-3">
      <Row className="align-items-center">
        <Col>
          <h2 className="mb-0 use-full me-2">Catálogo</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Catalogo;