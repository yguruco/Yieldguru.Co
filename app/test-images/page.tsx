"use client"

import React from 'react'

export default function TestImagesPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Image Test Page</h1>
      
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2>Electric Bus Image</h2>
        <img 
          src="/images/electric-bus.jpeg" 
          alt="Electric Bus" 
          style={{ maxWidth: '300px', maxHeight: '200px', display: 'block', marginBottom: '10px' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder.svg';
            console.error('Failed to load electric bus image');
          }}
        />
        <p>Path: /images/electric-bus.jpeg</p>
      </div>
      
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2>YG Logo</h2>
        <img 
          src="/images/yg-logo.png" 
          alt="YG Logo" 
          style={{ maxWidth: '300px', maxHeight: '200px', display: 'block', marginBottom: '10px' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder.svg';
            console.error('Failed to load YG logo');
          }}
        />
        <p>Path: /images/yg-logo.png</p>
      </div>
      
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2>YG LOGO (uppercase)</h2>
        <img 
          src="/images/YG LOGO.png" 
          alt="YG LOGO" 
          style={{ maxWidth: '300px', maxHeight: '200px', display: 'block', marginBottom: '10px' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder.svg';
            console.error('Failed to load YG LOGO (uppercase)');
          }}
        />
        <p>Path: /images/YG LOGO.png</p>
      </div>
      
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2>Ford Vehicle</h2>
        <img 
          src="/images/ford-vehicle.jpeg" 
          alt="Ford Vehicle" 
          style={{ maxWidth: '300px', maxHeight: '200px', display: 'block', marginBottom: '10px' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder.svg';
            console.error('Failed to load ford vehicle image');
          }}
        />
        <p>Path: /images/ford-vehicle.jpeg</p>
      </div>
      
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2>Ford</h2>
        <img 
          src="/images/ford.jpeg" 
          alt="Ford" 
          style={{ maxWidth: '300px', maxHeight: '200px', display: 'block', marginBottom: '10px' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/placeholder.svg';
            console.error('Failed to load ford image');
          }}
        />
        <p>Path: /images/ford.jpeg</p>
      </div>
      
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2>Placeholder</h2>
        <img 
          src="/placeholder.svg" 
          alt="Placeholder" 
          style={{ maxWidth: '300px', maxHeight: '200px', display: 'block', marginBottom: '10px' }}
          onError={(e) => {
            console.error('Failed to load placeholder image');
          }}
        />
        <p>Path: /placeholder.svg</p>
      </div>
    </div>
  )
}
