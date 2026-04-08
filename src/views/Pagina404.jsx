import { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';

const Pagina404 = () => {

  return (
    <Container className="mt-3">
      <Row className="align-items-center">
        <Col>
          <h2 className="bi-house-fill me-2">Página no encontrada</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Pagina404;