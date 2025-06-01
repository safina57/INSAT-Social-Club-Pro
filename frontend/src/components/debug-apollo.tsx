import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// Simple test query
const TEST_QUERY = gql`
  query TestQuery {
    dashboardAnalytics(timeframe: WEEK) {
      totalUsers
    }
  }
`;

export const DebugApollo: React.FC = () => {
  const token = localStorage.getItem('access_token');
  const { data, loading, error } = useQuery(TEST_QUERY);

  console.log('Token in localStorage:', token);
  console.log('Apollo Query Result:', { data, loading, error });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Apollo Client Debug</h3>
      <p><strong>Token present:</strong> {token ? 'Yes' : 'No'}</p>
      <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
      <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
      <p><strong>Data:</strong> {data ? JSON.stringify(data) : 'None'}</p>
      
      {error && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ffebee' }}>
          <strong>Full Error:</strong>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
