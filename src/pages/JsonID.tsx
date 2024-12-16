import React, { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useAuth } from "../components/Auth";

const TextInputPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [displayText, setDisplayText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputId, setInputId] = useState<string>('');
  const { authorizationToken } = useAuth();

  const [Code, setCode] = useState<string | null>(null);
  const [Label, setLabel] = useState<string | null>(null);
  const [KCS, setKCS] = useState<{ id: string }[] | null>(null);
  const [ProjectId, setProjectId] = useState<number | null>(null);
  const [Topics, setTopics] = useState<{ id: string }[] | null>(null);
  const [Tags, setTags] = useState<string[] | null>(null);
  const [Description, setDescription] = useState<string | null>(null);
  const [storedJson, setJson] = useState<any>(null);

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

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) { // Solo permitir números
      setInputId(value);
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
    if (!inputId.trim()) {
      setError('Debe ingresar un ID válido');
      return;
    }

    if (!inputText.trim()) {
      setError('El campo de texto está vacío');
      return;
    }

    if (!isValidJSON(inputText)) {
      setError('El texto ingresado no está en formato JSON válido');
      return;
    }

    try {
      // Ejecutar la lógica de recuperación
      await handleRecuperarClick();
  
      // Esperar hasta que el estado esté completamente actualizado
      await new Promise((resolve) => setTimeout(resolve, 0));
  
      // Validar que las variables necesarias estén listas
      if (!Code || !Label || !ProjectId || !Description || !KCS || !Topics || !Tags) {
        throw new Error('Haz click nuevamente en "Subir"');
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
          id: parseInt(inputId),
          code: Code,
          description: Description || '',
          json: JSON.parse(inputText),
          kcs: KCS ? KCS.map(item => parseInt(item.id)) : [],
          label: Label,
          projectId: ProjectId,
          tags: Tags || [],
          topics: Topics ? Topics.map(item => parseInt(item.id)) : [],
        },
      };
  
      const token = getAuthorizationToken();
      const response = await fetch('https://lm.inf.uach.cl/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ query, variables }),
      });
  
      const result = await response.json();
  
      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Error desconocido');
      }
  
      if (result.data.adminContent.updateContent) {
        setJson(result.data.adminContent.updateContent.json);
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
    if (!inputId.trim()) {
      setError('Debe ingresar un ID válido');
      return;
    }

    setLoading(true);
    setError(null);

    const query = `
      query getContent($ids: [IntID!]!) {
        content(ids: $ids) {
            code
            label
            kcs {id}
            project {id}
            topics {id}
            tags
            description
            json
        }
      }
    `;

    const variables = {
      ids: parseInt(inputId),
    };

    try {
      const token = getAuthorizationToken();
      const response = await fetch('https://lm.inf.uach.cl/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Error desconocido');
      }

      if (result.data.content && result.data.content.length > 0) {
        const contentData = result.data.content[0];
      
      // Almacenar cada dato individualmente
        setCode(contentData.code);
        setLabel(contentData.label);
        setKCS(contentData.kcs);
        setProjectId(contentData.project.id);
        setTopics(contentData.topics);
        setTags(contentData.tags);
        setDescription(contentData.description);
        setJson(contentData.json);

        setDisplayText(JSON.stringify(contentData.json, null, 2));
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <label htmlFor="idInput" style={{ marginRight: '10px', fontWeight: 'bold' }}>Ingrese ID:</label>
        <input
          id="idInput"
          type="text"
          value={inputId}
          onChange={handleIdChange}
          style={{ width: '100px', padding: '5px', border: '1px solid black', textAlign: 'center' }}
        />
      </div>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Ingrese texto en formato JSON"
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
      <div>
        <Box as="pre" bg="gray.100" p={4} borderRadius="md" overflow="auto" maxW="1050px">
          {displayText}
        </Box>
      </div>
    </div>
  );
};

export default TextInputPage;
