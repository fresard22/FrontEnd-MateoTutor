import React, { useState } from 'react';

const getAuthToken = () => {
  // HAY QUE MODIFICAR ESTA FUNCION
  const token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImI5QW9hNlFWLTQ3dU8tYWJuVmlaUiJ9.eyJuaWNrbmFtZSI6Im5pY29sZS5uYXZhcnJvIiwibmFtZSI6Im5pY29sZS5uYXZhcnJvQGFsdW1ub3MudWFjaC5jbCIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci8xYWQxYzRkMDM4Y2U4YzA5NmNhNWUxNWViYmI3M2Q3YT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRm5pLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDI0LTEyLTA1VDE3OjEyOjAyLjE2OVoiLCJlbWFpbCI6Im5pY29sZS5uYXZhcnJvQGFsdW1ub3MudWFjaC5jbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2xlYXJuZXItbW9kZWwtZ3FsLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJSUmZCTEp2UGx4MlI2b3BmaFlxR1NiMjNvaDd2WlVGeCIsImlhdCI6MTczMzU4NjA5MywiZXhwIjoxNzMzNjIyMDkzLCJzdWIiOiJhdXRoMHw2NTViYzQ5NzA0NzViMmQ0NGMzYjNlODAiLCJzaWQiOiJxUkJ0LWQ5UW55ZG9aVlZLNF9VcTV0a1ZqZGUxc3Y4bCIsIm5vbmNlIjoiVW5CSlMwSkZjWEZvVDJSQ2JISXRUVzFoY0VSMFJUQlZiMFZvU25kS1ExOHRXVVV6VVhKRFlVbzVPQT09In0.Gc3iB6G3wqHs8EHMyXWuy9cdR9mAftg2i1bQ3T302iX9gMXabsjHTSCYRgwToZkXttfxtmsh7BllAZAgOIpAm6Dt-TpKw2UHs8xx1L8_S4f4DsNGTHgUL4BuAzSzQIrebraENQeelxbwvhP63pdXwez3il6mKFCGf9LnNq-y8OWfExCqT7ilFh9rxxc3VAcqoHR731p0ZGbz3Ktcg7KAdIEjiDGjWYsHImImj6_amPe2PUVvkX7DJTceaCM106l84fnTtQYP9CR8ufI9iGMHrIAsEyfmcFH-mruEdxkdaTxUnQ23DwlJ3CmQKHZWw8Um2C1RzGq2plYIR27GW-howA';
  // Ya que el token cambia constantemente (es necesario obtenerlo de una manera dinámica)
  return token;
};

const TextInputPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [storedJson, setStoredJson] = useState<any>(null);
  const [displayText, setDisplayText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleInputFocus = () => {
    if (inputText === '¡Texto subido!') {
      setInputText('');
    }
  };

  const isValidJSON = (text: string): boolean => {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleUploadClick = async () => {
    if (!inputText.trim()) {
      setError('El campo de texto está vacío');
      return;
    }

    if (!isValidJSON(inputText)) {
      setError('El texto ingresado no está en formato JSON válido');
      return;
    }

    setLoading(true);
    setError(null);

    const query = `
      mutation UpdateContent($data: UpdateContent!) {
        adminContent {
          updateContent(data: $data) {
            id
            json
            project {
              id
            }
          }
        }
      }
    `;

    const variables = {
      data: {
        id: 556,
        code: "tg7",
        description: "Prueba 3",
        json: JSON.parse(inputText), // Se usa el texto ingresado como el campo JSON
        kcs: 1,
        label: "Testeos-G7",
        projectId: 9,
        tags: "testeos",
        topics: 1,
      },
    };

    try {
      const response = await fetch('https://lm.inf.uach.cl/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken(), // Aquí agregamos el token a las cabeceras
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Error desconocido');
      }

      if (result.data.adminContent.updateContent) {
        setStoredJson(result.data.adminContent.updateContent.json); // Guardar el JSON actualizado
        setInputText('¡JSON subido!');
      } else {
        throw new Error('No se pudo actualizar el JSON');
      }
    } catch (err: any) {
      setError(err.message || 'Error al subir el JSON');
    } finally {
      setLoading(false);
    }
  };

  const handleRetrieveClick = async () => {
    setLoading(true);
    setError(null);

    const query = `
      query GetJson($ids: [IntID!]!) {
        content(ids: $ids) {
          json
        }
      }
    `;

    const variables = {
      ids: [556],
    };

    try {
      const response = await fetch('https://lm.inf.uach.cl/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken(),
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Error desconocido');
      }

      if (result.data.content && result.data.content.length > 0) {
        const contentJson = result.data.content[0].json;
        setStoredJson(contentJson);
        setDisplayText(JSON.stringify(contentJson, null, 2));
      } else {
        setDisplayText('No se encontró contenido');
      }
    } catch (err: any) {
      setError(err.message || 'Error al recuperar el contenido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          style={{ width: '300px', padding: '10px', marginBottom: '10px', border: '1px solid black' }}
        />
      </div>
      <div>
        <button onClick={handleUploadClick} style={{ marginRight: '10px' }} disabled={loading}>
          {loading ? 'Subiendo...' : 'Subir'}
        </button>
        <button onClick={handleRetrieveClick} style={{ marginRight: '10px' }} disabled={loading}>
          {loading ? 'Recuperando...' : 'Recuperar'}
        </button>
      </div>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}
      <div style={{ width: '300px', marginTop: '20px', padding: '10px', border: '1px solid black', textAlign: 'center', whiteSpace: 'pre-wrap' }}>
        {displayText}
      </div>
    </div>
  );
};

export default TextInputPage;
