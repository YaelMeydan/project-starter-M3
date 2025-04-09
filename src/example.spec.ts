import request from 'supertest'; //  For making HTTP requests in tests
import { app } from './app'; //  Import your Express app
import express from 'express';

describe('App Routes', () => {
  // Mock Express app
  let server: express.Express;

  beforeAll(() => {
      server = app;
  });

  it('should redirect to 404.html for unknown routes', async () => {
    const response = await request(server).get('/some-unknown-route');
    expect(response.header.location).toBe('404.html');
    expect(response.status).toBe(302); // Redirect status code
  });
});

describe('API Routes', () => {
    // Mock Express app
    let server: express.Express;
  
    beforeAll(() => {
        server = app;
    });
  
    it('should return a 200 status code for GET /api', async () => {
      const response = await request(server).get('/api');
      expect(response.status).toBe(200);
    });
  
    it('should return the correct JSON response for GET /api', async () => {
      const response = await request(server).get('/api');
      expect(response.body).toEqual({ message: '' }); // Check the expected JSON
    });
  });