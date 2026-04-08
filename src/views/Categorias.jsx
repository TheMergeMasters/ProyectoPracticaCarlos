import { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';

const Categorias = () => {

  return (
    <Container className="mt-3">
      <Row className="align-items-center">
        <Col>
          <h2 className="bi-house-fill me-2">Categorías</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Categorias;