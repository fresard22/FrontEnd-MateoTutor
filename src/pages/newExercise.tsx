import { Select, Box, Button, Input, Flex, Text, Stack } from '@chakra-ui/react';
import { useState } from 'react';

export default function newExercise() {
  // Estado inicial: tarjeta de tipo "enunciado"
  const [cards, setCards] = useState([{ type: 'enunciado', content: '', subtasks: [] }]);

  const topics = {
    Factorización: ['Factorización por factor común', 'Factorización por agrupación', 'Diferencia de cuadrados'],
    ProductosNotables: ['Binomio al cuadrado', 'Trinomio cuadrado perfecto', 'Binomio conjugado'],
    Fracciones: ['Suma y resta de fracciones', 'Multiplicación y división de fracciones'],
    Raíces: ['Raíz cuadrada', 'Raíz cúbica', 'Raíces de índice n'],
  };

  const addCard = () => {
    // Agregar siempre una tarjeta de tipo "paso"
    setCards([...cards, { type: 'paso', content: '', subtasks: [] }]);
  };

  const handleCardTypeChange = (index, newType) => {
    const updatedCards = [...cards];
    updatedCards[index].type = newType;
    if (newType === 'paso') {
      updatedCards[index].subtasks = [];
    }
    setCards(updatedCards);
  };

  const addSubtask = (index) => {
    const updatedCards = [...cards];
    if (updatedCards[index].type === 'paso') {
      updatedCards[index].subtasks.push({ type: 'pista', content: '' });
      setCards(updatedCards);
    }
  };

  const handleSubtaskContentChange = (cardIndex, subtaskIndex, newContent) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].subtasks[subtaskIndex].content = newContent;
    setCards(updatedCards);
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'enunciado':
        return 'blue.200'; // Color para "Enunciado"
      case 'paso':
        return 'green.200'; // Color para "Paso"
      case 'pista':
        return 'yellow.200'; // Color para "Pista"
      default:
        return 'gray.200'; // Color por defecto
    }
  };

  const getCardLabel = (type) => {
    switch (type) {
      case 'enunciado':
        return 'Enunciado';
      case 'paso':
        return 'Paso';
      case 'pista':
        return 'Pista';
      default:
        return 'Desconocido';
    }
  };

  const saveData = () => {
    alert('Datos a guardar:\n' + 'Tarjetas: ' + JSON.stringify(cards));
  };

  return (
    <>
      <div>
        <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
          {/* Renderiza las tarjetas */}
          {cards.map((card, index) => (
            <Flex
              key={index}
              mt={4}
              w="100%"
              maxW="800px"
              p={6}
              borderRadius="md"
              bg={getCardColor(card.type)}
              boxShadow="md"
              alignItems="center"
              direction="row"
              position="relative"
            >
              {/* Texto del tipo de tarjeta, rotado -90 grados y posicionado a la izquierda */}
              <Text
                position="absolute"
                left="-10px"  // Ajusta este valor para la distancia horizontal
                top="50%"     // Coloca el texto en el centro verticalmente
                transform="translateY(-50%) rotate(-90deg)"  // Centra el texto verticalmente y lo rota
                transformOrigin="left bottom"  // Mantiene la rotación desde la esquina inferior izquierda
                fontSize="lg"
                fontWeight="bold"
              >
                {getCardLabel(card.type)}
              </Text>

              <Box flex="1" w="100%">
                {/* Tarjeta de tipo "enunciado" no puede cambiarse */}
                {card.type === 'enunciado' ? (
                  <>

                    <Input
                      placeholder={`Contenido del enunciado`}
                      value={card.content}
                      onChange={(e) => {
                        const updatedCards = [...cards];
                        updatedCards[index].content = e.target.value;
                        setCards(updatedCards);
                      }}
                      bg="white"
                    />
                  </>
                ) : (
                  <>
                    {/* Cuadro de texto dentro de la tarjeta */}
                    <Input
                      placeholder={`Contenido de la tarjeta ${index + 1}`}
                      value={card.content}
                      onChange={(e) => {
                        const updatedCards = [...cards];
                        updatedCards[index].content = e.target.value;
                        setCards(updatedCards);
                      }}
                      bg="white"
                    />

                    {/* Si la tarjeta es de tipo "paso", mostrar un botón para agregar subtareas */}
                    {card.type === 'paso' && (
                      <>
                        <Button onClick={() => addSubtask(index)} mt={4}>
                          Agregar pista
                        </Button>
                        {/* Renderiza las subtareas */}
                        {card.subtasks.map((subtask, subIndex) => (
                          <Flex
                            key={subIndex}
                            mt={2}
                            p={4}
                            bg={getCardColor(subtask.type)}
                            borderRadius="md"
                            boxShadow="md"
                            alignItems="center"
                          >
                            <Text mr={4} fontWeight="bold">{getCardLabel(subtask.type)+subIndex}</Text>
                            <Input
                              placeholder={`Pista ${subIndex + 1}`}
                              value={subtask.content}
                              onChange={(e) => handleSubtaskContentChange(index, subIndex, e.target.value)}
                              bg="white"
                            />
                          </Flex>
                        ))}
                      </>
                    )}
                  </>
                )}
              </Box>
            </Flex>
          ))}

          {/* Botón para agregar una nueva tarjeta (solo tarjetas de tipo "paso") */}
          <Stack spacing={4} direction="row" align="center">
            <Button onClick={addCard} alignSelf="center">
              Agregar tarjeta tipo paso
            </Button>
            <Button colorScheme="green" onClick={saveData} alignSelf="center">
              Guardar Cambios
            </Button>
          </Stack>
        </Flex>
      </div>
    </>
  );
}
