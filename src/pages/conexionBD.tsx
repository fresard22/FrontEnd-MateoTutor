import React, { useState } from 'react';
import { useAuth } from "../components/Auth";

const TextInputPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [storedJson, setStoredJson] = useState<any>(null);
  const [displayText, setDisplayText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);  
  const { authorizationToken } = useAuth();

// ############################################################################################################

  const getAuthorizationToken = () => {
    if (!authorizationToken) {
      throw new Error("Authorization token not found. Ensure the user is logged in.");
    }
    return authorizationToken;
  };

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

// ############################################################################################################

  const handleSubirClick = async () => {
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
      const token = getAuthorizationToken(); // Ahora obtenemos el token aquí de forma sincrónica
      const response = await fetch('https://lm.inf.uach.cl/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // Ahora pasamos el token directamente
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

// ############################################################################################################

  const handleRecuperarClick = async () => {
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
      const token = getAuthorizationToken(); // Ahora obtenemos el token aquí de forma sincrónica
      const response = await fetch('https://lm.inf.uach.cl/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // Ahora pasamos el token directamente
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

// ############################################################################################################

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
        <button onClick={handleSubirClick} style={{ marginRight: '10px' }} disabled={loading}>
          {loading ? 'Subiendo...' : 'Subir'}
        </button>
        <button onClick={handleRecuperarClick} style={{ marginRight: '10px' }} disabled={loading}>
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
