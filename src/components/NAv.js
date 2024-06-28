import React from 'react';
import '../App.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
export default function NAv() {
    return (
        <>
            <Navbar className=" bg-dark">
                <Container className='d-flex justify-content-center p-2 bg-dark'>
                    <Navbar.Brand href='#' className='text-white'>Question Answering with TensorFlow.js</Navbar.Brand>
                </Container>
            </Navbar>

        </>
    )
}
