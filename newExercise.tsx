import { Select, Box, Button, Input, Flex, Text, Stack, Checkbox, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Table,Thead,Tbody,Tr,Th,Td,TableContainer,useToast  } from '@chakra-ui/react';
import { useState,useCallback,useEffect } from 'react';
import React from 'react';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { generarEjercicioJSON, descargarJSON } from './jsonTransform';

export default function NewExercise() {
  const [cards, setCards] = useState([
    { 
      type: 'enunciado', 
      title: '', 
      question: '', 
      expression: '', 
      summary: '', 
      successMessage: '', 
      latex: '', // Este campo debe estar presente y vacío
      blank: '',
      alternatives: [{ text: '', correct: false }, { text: '', correct: false }], 
      hints: [{ text: '' }, { text: '' }], 
      respuestas: '' 
    }
  ]);

  // Función para cargar tarjetas desde localStorage
  const loadFromCache = () => {
    const cachedData = localStorage.getItem('cardsCache');
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        setCards(data.cards); // Restaurar tarjetas desde el cache
      } catch (error) {
        console.error('Error al parsear el JSON del cache:', error);
      }
    }
  };  

  //guarde en cache
  const saveToCache = (newCards) => {
    localStorage.setItem('cardsCache', JSON.stringify({ cards: newCards }));
  };

  // useEffect para cargar tarjetas desde el cache cuando el componente se monta
  useEffect(() => {
    loadFromCache();
  }, []);

  // useEffect para guardar en cache cada vez que se actualizan las tarjetas
  useEffect(() => {
    saveToCache(cards); // Guardar en cache siempre que cambien las tarjetas
  }, [cards]);

  const [currentCardIndex, setCurrentCardIndex] = useState(null); // Índice de la tarjeta seleccionada
  const { isOpen, onOpen, onClose } = useDisclosure(); // Estado del modal
  const { isOpen: isLatexOpen, onOpen: onOpenLatex, onClose: onLatexClose } = useDisclosure();
  const operations = [ //Operaciones del modal
    { label: '+', command: '+' }, { label: '-', command: '-' }, { label: '×', command: '\\times' },
    { label: '÷', command: '\\div' }, { label: '\\frac{□}{□}', command: '\\frac{}{}' }, { label: '=', command: '=' },
    { label: '≠', command: '\\neq' }, { label: '<', command: '<' }, { label: '>', command: '>' },
    { label: '≤', command: '\\leq' }, { label: '≥', command: '\\geq' }, { label: '±', command: '\\pm' },
    { label: '·', command: '\\cdot' }, { label: '\\sqrt{□}', command: '\\sqrt{}' }, { label: '□^n', command: '^{}' },
    { label: '□ₙ', command: '_{}' }, { label: '\\sum', command: '\\sum_{}^{}' }, { label: '\\int_{□}^{□}', command: '\\int_{}^{}' },
    { label: '∞', command: '\\infty' }, { label: 'π', command: '\\pi' }, { label: '\\sin', command: '\\sin' },
    { label: '\\cos', command: '\\cos' }, { label: '\\tan', command: '\\tan' }, { label: '\\log', command: '\\log' },
    { label: '\\ln', command: '\\ln' }, { label: '\\lim_{x \\to {□}}{□}', command: '\\lim_{x \\to {}}' }, { label: '()', command: '()' },
    { label: '[]', command: '\\left[ \\right]' }, { label: '{}', command: '\\left\\{ \\right\\}' }
  ];
  const updateCard = (index, updatedProps) => {
    setCards(cards.map((card, i) => (i === index ? { ...card, ...updatedProps } : card)));
  };
  const insertLatex = (command) => {
    if (currentCardIndex !== null) {
      // Determinar el campo activo
      const activeField =
        activeAlternativeIndex !== null
          ? { type: 'alternative', index: activeAlternativeIndex }
          : activeHintIndex !== null
          ? { type: 'hint', index: activeHintIndex }
          : isBlankActive
          ? { type: 'blank' }
          : isPlaceholderActive
          ? { type: 'placeholder' }
          : isResponseActive
          ? { type: 'response' }
          : { type: 'enunciado' };
  
      const inputElement = document.getElementById(
        `latex-input-${currentCardIndex}-${
          activeField.type === 'alternative'
            ? `alternative-${activeField.index}`
            : activeField.type === 'hint'
            ? `hint-${activeField.index}`
            : activeField.type
        }`
      );
  
      if (inputElement) {
        const startPos = inputElement.selectionStart;
        const endPos = inputElement.selectionEnd;
  
        const currentValue =
          activeField.type === 'alternative'
            ? cards[currentCardIndex]?.alternatives[activeField.index]?.latex || ''
            : activeField.type === 'hint'
            ? cards[currentCardIndex]?.hints[activeField.index]?.latex || ''
            : activeField.type === 'blank'
            ? cards[currentCardIndex]?.blank || ''
            : activeField.type === 'placeholder'
            ? cards[currentCardIndex]?.placeholders || ''
            : activeField.type === 'response'
            ? cards[currentCardIndex]?.respuestas || ''
            : cards[currentCardIndex]?.latex || '';
  
        const updatedValue =
          currentValue.slice(0, startPos) + command + currentValue.slice(endPos);
  
        // Actualizar el estado dependiendo del campo activo
        if (activeField.type === 'alternative') {
          updateAlternative(currentCardIndex, activeField.index, { latex: updatedValue });
        } else if (activeField.type === 'hint') {
          updateHint(currentCardIndex, activeField.index, { latex: updatedValue });
        } else if (activeField.type === 'blank') {
          updateCard(currentCardIndex, { blank: updatedValue });
        } else if (activeField.type === 'placeholder') {
          updateCard(currentCardIndex, { placeholders: updatedValue });
        } else if (activeField.type === 'response') {
          updateCard(currentCardIndex, { respuestas: updatedValue });
        } else {
          updateCard(currentCardIndex, { latex: updatedValue });
        }
  
        // Mover el cursor al final del comando insertado
        setTimeout(() => {
          inputElement.selectionStart = inputElement.selectionEnd = startPos + command.length;
        }, 0);
      }
    }
  };
  
  const toast = useToast();
  const [newCardType, setNewCardType] = useState('alternativas');
  const addCard = () => {
    if (newCardType === 'alternativas') {
      setCards([...cards, { type: 'alternativas', title: '', question: '', expression: '', summary: '', successMessage: '', alternatives: [{ text: '', correct: false }, { text: '', correct: false }], hints: [{ text: ''}, { text: ''}],kcs: ''}]);
    } else if (newCardType === 'verdadero/falso') {
      setCards([...cards, { type: 'verdadero/falso', title: '', question: '', expression: '', summary: '', successMessage: '', trueOption: false, falseOption: false, hints: [{ text: ''}, { text: ''}],kcs: ''}]);
    } else if (newCardType === 'multipleplaceholder') {
      setCards([...cards, {type: 'multipleplaceholder', title: '', question: '', expression: '', summary: '', successMessage: '', placeholders: '', respuestas: '' ,hints: [{ text: ''}, { text: ''}],kcs: ''}]);
    }else if (newCardType === 'blank') {
      setCards([...cards, {type: 'blank', title: '', question: '', expression: '', summary: '', successMessage: '', placeholders: '', respuestas: '' ,hints: [{ text: ''}, { text: ''}],kcs: ''}]);
    }
    else if (newCardType === 'table') {
      setCards([...cards, {type: 'table', title: '', question: '', expression: '', summary: '', successMessage: '', respuestas: new Array(4).fill('') ,hints: [{ text: ''}, { text: ''}],kcs: ''}]);
    }
    onClose();
  };
  /*const handleCardContentChange = (index, field, newContent) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = newContent;
    setCards(updatedCards);
  };
  const handleHintChange = (cardIndex, hintIndex, newContent) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].hints = updatedCards[cardIndex].hints.map((hint, index) => ({
      ...hint,
      text: index === hintIndex ? newContent : hint.text,
    }));
    setCards(updatedCards);
  };
  const handleAlternativeChange = (cardIndex, altIndex, newContent) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].alternatives = updatedCards[cardIndex].alternatives.map((alt, index) => ({
      ...alt,
      text: index === altIndex ? newContent : alt.text,
    }));
    setCards(updatedCards);
  };*/
  const handleCorrectChange = (cardIndex, altIndex) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].alternatives = updatedCards[cardIndex].alternatives.map((alt, index) => ({
      ...alt,
      correct: index === altIndex
    }));
    setCards(updatedCards);
  };
  const handleTrueFalseChange = (index, option) => {
    const updatedCards = [...cards];
    if (option === 'trueOption') {
      updatedCards[index].trueOption = !updatedCards[index].trueOption;
      updatedCards[index].falseOption = false;
    } else if (option === 'falseOption') {
      updatedCards[index].falseOption = !updatedCards[index].falseOption;
      updatedCards[index].trueOption = false;
    }
    setCards(updatedCards);
  };
  const addAlternative = (index) => {
    const updatedCards = [...cards];
    updatedCards[index].alternatives.push({ text: '', correct: false });
    setCards(updatedCards);
  };
  const addHints = (index) => {
    const updatedCards = [...cards];
    updatedCards[index].hints.push({ text: ''});
    setCards(updatedCards);
  };
  const removeAlternative = (cardIndex, altIndex) => {
    const updatedCards = [...cards];
    if (updatedCards[cardIndex].alternatives.length > 2) {
      updatedCards[cardIndex].alternatives.splice(altIndex, 1);
      setCards(updatedCards);
    }
  };
  const handleOpenLatexModal = (index) => {
    setCurrentCardIndex(index); // Establecemos el índice de la tarjeta actual
    onLatexOpen(); // Abre el modal de LaTeX, asegúrate de tener un useDisclosure para este modal
  };
  const removeHints = (cardIndex, hintIndex) => {
    const updatedCards = [...cards];
    if (updatedCards[cardIndex].hints.length > 2) {
      updatedCards[cardIndex].hints.splice(hintIndex, 1);
      setCards(updatedCards);
    }
  };
  const getCardColor = (type) => {
    switch (type) {
      case 'enunciado':
        return 'blue.200';
      case 'alternativas':
        return 'green.200';
      case 'verdadero/falso':
        return 'purple.200';     
      case 'multipleplaceholder':
        return 'orange.200';
      case 'blank':
        return 'red.200';
        case 'table':
          return 'blue.400';
      default:
        return 'gray.200';
    }
  };
  const getCardLabel = (type) => {
    switch (type) {
      case 'enunciado':
        return 'Enunciado';
      case 'alternativas':
        return 'Alternativas';
      case 'verdadero/falso':
        return 'Verdadero/Falso';
      case 'multipleplaceholder':
        return 'Placeholders';
      case 'blank':
        return 'Blank';
        case 'table':
          return 'Tabla de verdad';
      default:
        return 'Desconocido';
    }
  };
  const deleteCard = (index) => {
    const isConfirmed = window.confirm('¿Realmente deseas eliminar este paso?');
    if (isConfirmed){
      const updatedCards = cards.filter((_, i) => i !== index);
      setCards(updatedCards);
    }
  }; 

  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseCode, setExerciseCode] = useState('');
  const [exerciseTopic, setExerciseTopic] = useState('');
  const [tempExerciseName, setTempExerciseName] = useState('');
  const [tempExerciseCode, setTempExerciseCode] = useState('');
  const [tempExerciseTopic, setTempExerciseTopic] = useState('');
  const { isOpen: isModal2Open, onOpen: onModal2Open, onClose: onModal2Close } = useDisclosure();
  const [activeModal, setActiveModal] = React.useState(null);
 
  useEffect(() => {
    // Imprime el contenido de cards cuando el componente se monta o cuando cards cambia
    console.log("Contenido de cards:", cards);
  }, [cards]);

  const handleSave = () => {
    const updatedCards = cards.map((card, index) => {
    
      const titleInput = document.querySelector(`#card-title-${index}`);
      const questionInput = document.querySelector(`#card-question-${index}`);
      const latexInput = document.querySelector(`#card-latex-${index}`);
      const summaryInput = document.querySelector(`#card-summary-${index}`);
      const successMessageInput = document.querySelector(`#card-success-message-${index}`);
      const kcsInput = document.querySelector(`#card-kcs-${index}`);
 
      return {
        ...card,
        title: titleInput ? titleInput.value : card.title,
        question: questionInput ? questionInput.value : card.question,
        latex: latexInput ? latexInput.value : card.latex,
        summary: summaryInput ? summaryInput.value : card.summary,
        successMessage: successMessageInput ? successMessageInput.value : card.successMessage,
        kcs: kcsInput ? kcsInput.value : card.kcs,     
        ...(card.type === 'alternativas' && {
          alternatives: card.alternatives.map((alt, altIndex) => ({
            ...alt,
            text: document.querySelector(`#card-alternative-${index}-${altIndex}`)?.value || alt.text
          }))
        }),
        ...(card.type === 'verdadero/falso' && {
          trueOption: card.trueOption,
          falseOption: card.falseOption
        }),
        ...(card.type === 'singleplaceholder' && {
          placeholders: document.querySelector(`#card-placeholder-${index}`)?.value || card.placeholders,
          respuestas: document.querySelector(`#card-respuestas-${index}`)?.value || card.respuestas
        }),
        ...(card.type === 'multipleplaceholder' && {
          placeholders: document.querySelector(`#card-placeholder-${index}`)?.value || card.placeholders,
          respuestas: document.querySelector(`#card-respuestas-${index}`)?.value || card.respuestas
        }),
        ...(card.type === 'table' && {
          respuestas: card.respuestas
        }),     
        hints: card.hints.map((hint, hintIndex) => ({
          ...hint,
          text: document.querySelector(`#card-hint-${index}-${hintIndex}`)?.value || hint.text
        }))
      };
    });

    const exerciseNameInput = document.querySelector('#exercise-name-input');
    const exerciseCodeInput = document.querySelector('#exercise-code-input');
    const exerciseTopicSelect = document.querySelector('#exercise-topic-select');

    const ejercicioJSON = generarEjercicioJSON(
      updatedCards, 
      exerciseCodeInput ? exerciseCodeInput.value : exerciseCode,
      exerciseNameInput ? exerciseNameInput.value : exerciseName,
      exerciseTopicSelect ? exerciseTopicSelect.value : exerciseTopic
    );
    descargarJSON(ejercicioJSON, "ejercicio.json");
    localStorage.clear();
  };

  const saveData = () => {
    alert('Datos a guardar:\n' + 'Tarjetas: ' + JSON.stringify(cards));
  };

  const [rowValues, setRowValues] = useState(new Array(4).fill('')); 
  const handleButtonClick = useCallback((cardIndex, answerIndex) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      const currentRespuestas = updatedCards[cardIndex].respuestas|| [];
      currentRespuestas[answerIndex] = currentRespuestas[answerIndex] === 'V' ? 'F' : 'V'; // Toggle value
      return updatedCards;
    });
  }, []); 

  const staticValues = [
    { P: 'V', Q: 'V' },
    { P: 'V', Q: 'F' },
    { P: 'F', Q: 'V' },
    { P: 'F', Q: 'F' },
  ];

  {/*Para la funcion del modal con el campo INICIO */}
  const [isResponseActive, setIsResponseActive] = useState(false); // Indica si el campo Respuestas está activo
  const [isPlaceholderActive, setIsPlaceholderActive] = useState(false); // Controla si el campo Placeholders está activo
  const [isBlankActive, setIsBlankActive] = useState(false); // Indica si el campo Blank está activo
  const [activeHintIndex, setActiveHintIndex] = useState(null); // Para las pistas
  const [activeAlternativeIndex, setActiveAlternativeIndex] = useState(null); // Para las alternativas

  const updateHint = (cardIndex, hintIndex, updatedFields) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].hints[hintIndex] = {
      ...updatedCards[cardIndex].hints[hintIndex],
      ...updatedFields,
    };
    setCards(updatedCards);
  };
  
  const updateAlternative = (cardIndex, altIndex, updatedValues) => {
    setCards((prevCards) =>
      prevCards.map((card, cIndex) =>
        cIndex === cardIndex
          ? {
              ...card,
              alternatives: card.alternatives.map((alt, aIndex) =>
                aIndex === altIndex ? { ...alt, ...updatedValues } : alt
              ),
            }
          : card
      )
    );
  };
  {/*Para la funcion del modal con el campo FIN */}
  console.log("render")
  return (
    <MathJaxContext> 
      <div>
        <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
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
              direction="column"
              position="relative"
              justifyContent="space-between"
            >
              <Text
                position="absolute"
                left="-10px"
                top="50%"
                transform="translateY(-50%) rotate(-90deg)"
                transformOrigin="left bottom"
                fontSize="lg"
                fontWeight="bold"
              >
                {(getCardLabel(card.type) === "Enunciado" ?  getCardLabel(card.type) : getCardLabel(card.type) + " " + index )}
              </Text>
              <Box flex="1" w="100%">
              {card.type != 'enunciado' ? (
  <>
    <Input
      id={`card-title-${index}`}
      placeholder="Titulo del paso"
      bg="white"
      mb={2}
    />
    <Input
    id={`card-question-${index}`}
      placeholder={`Pregunta del paso`}
      bg="white"
      mb={2}
    />
              {/* CUADRO DE TEXTO PARA LATEX (INICIO)*/}
              <Box mb={2}>
                <Box display="flex" alignItems="center">
                  {card.isEditing ? (
                    <Input
                      placeholder="Expresión"
                      value={card.latex || ''}
                      onChange={(e) => updateCard(index, { latex: e.target.value })}
                      onBlur={() => updateCard(index, { isEditing: false })}
                      bg="white"
                      flex="1"
                      mb={0}
                      fontSize="md" // Tamaño igual al placeholder
                      fontFamily="body" // Fuente consistente
                      color="black"
                      _placeholder={{ color: "#ccd3dd", fontSize: "md" }} // Placeholder con color gris claro
                    />
                  ) : (
                    <Box
                      bg="white"
                      borderWidth="1px"
                      borderRadius="md"
                      cursor="pointer"
                      flex="1"
                      px={4} // Padding horizontal similar al Input
                      py={2} // Padding vertical similar al Input
                      fontSize="md" // Igual tamaño de fuente que el Input
                      fontFamily="body" // Misma fuente
                      color={card.latex ? "black" : "#ccd3dd"} // Color dinámico: gris claro o negro
                      onClick={() => updateCard(index, { isEditing: true })}
                    >
                      {card.latex ? (
                        <MathJax>{`\\(${card.latex}\\)`}</MathJax> // Renderiza LaTeX si existe contenido
                      ) : (
                        "Expresión" // Texto fijo "Expresión"
                      )}
                    </Box>
                  )}
                <Button size="xs" ml={2} onClick={() => (setCurrentCardIndex(index), onOpenLatex())}>?</Button>
                </Box>
              </Box>
              {/* CUADRO DE TEXTO PARA LATEX (FIN) */}
  </> 
) : (
  <></>
)}
                {card.type === 'enunciado' ? (
                  <>
                    <Input
                      placeholder={`Contenido del enunciado`}
                      bg="white"
                    />
                  </>
                  ): card.type === 'blank' ? (
                    <>
                    <Box mb={4} p={4} bg="yellow.300" borderRadius="md" boxShadow="md">
                      <Text fontWeight="bold" mb={2}>
                        Blank
                      </Text>
                      <Flex key={index} align="center" gap={2}>
                        {/* Campo LaTeX para expresión del ejercicio */}
                        <Flex align="center" gap={2} flex="1">
                          {card.isEditingBlank ? (
                            <Input
                              id={`blank-latex-${index}`}
                              placeholder="Expresión LaTeX"
                              value={card.blank || ''}
                              onChange={(e) => updateCard(index, { blank: e.target.value })}
                              onBlur={() => updateCard(index, { isEditingBlank: false })}
                              bg="white"
                              fontSize="sm"
                              color="black"
                              flex="1"
                            />
                          ) : (
                            <Box
                              bg="white"
                              borderWidth="1px"
                              borderRadius="md"
                              px={3}
                              py={2}
                              cursor="pointer"
                              flex="1"
                              onClick={() => updateCard(index, { isEditingBlank: true })}
                            >
                              {card.blank ? (
                                <MathJax>{`\\(${card.blank}\\)`}</MathJax>
                              ) : (
                                <Text color="gray.500" fontSize="sm">Haz clic para agregar expresión</Text>
                              )}
                            </Box>
                          )}
                          {/* Botón para abrir el modal de ayuda LaTeX */}
                          <Button
                            size="xs"
                            onClick={() => {
                              setCurrentCardIndex(index); // Índice actual de la tarjeta
                              setIsBlankActive(true); // Indica que estamos trabajando con Blank
                              onOpenLatex(); // Abre el modal
                            }}
                            aria-label="Abrir ayuda LaTeX para Blank"
                          >
                            ?
                          </Button>
                        </Flex>
                        {/* Selector para método de corrección */}
                        <Select
                          placeholder="Seleccione un método de corrección"
                          bg="white"
                          flex="1"
                        >
                          <option value="StringComparison">StringComparison</option>
                          <option value="EvaluateandCount">EvaluateandCount</option>
                          <option value="Evaluate">Evaluate</option>
                        </Select>
                      </Flex>
                    </Box>
                    </>
                  ) : card.type === 'multipleplaceholder' ? (
                  <>
                  <Box mb={4} p={4} bg="yellow.300" borderRadius="md" boxShadow="md">
                    <Text fontWeight="bold" mb={2}>
                      Placeholders
                    </Text>
                    <Flex key={index} align="center" gap={2}>
                      {/* Campo LaTeX para expresión con placeholders */}
                      <Flex align="center" gap={2} flex="1">
                        {card.isEditingPlaceholders ? (
                          <Input
                            placeholder="Expresión con placeholders"
                            value={card.placeholders || ''}
                            onChange={(e) =>
                              setCards((prevCards) =>
                                prevCards.map((c, i) =>
                                  i === index ? { ...c, placeholders: e.target.value } : c
                                )
                              )
                            }
                            onBlur={() =>
                              setCards((prevCards) =>
                                prevCards.map((c, i) =>
                                  i === index ? { ...c, isEditingPlaceholders: false } : c
                                )
                              )
                            }
                            bg="white"
                            fontSize="sm"
                            color="black"
                            flex="1"
                          />
                        ) : (
                          <Box
                            bg="white"
                            borderWidth="1px"
                            borderRadius="md"
                            px={3}
                            py={2}
                            cursor="pointer"
                            flex="1"
                            onClick={() =>
                              setCards((prevCards) =>
                                prevCards.map((c, i) =>
                                  i === index ? { ...c, isEditingPlaceholders: true } : c
                                )
                              )
                            }
                          >
                            {card.placeholders ? (
                              <MathJax>{`\\(${card.placeholders}\\)`}</MathJax>
                            ) : (
                              <Text color="gray.500" fontSize="sm">
                                Haz clic para agregar expresión
                              </Text>
                            )}
                          </Box>
                        )}
                        {/* Botón para abrir el modal de ayuda LaTeX */}
                        <Button
                          size="xs"
                          onClick={() => {
                            setCurrentCardIndex(index);
                            setIsBlankActive(false);
                            setActiveAlternativeIndex(null);
                            setActiveHintIndex(null);
                            setIsPlaceholderActive(true);
                            setIsResponseActive(false); // Desactiva el estado de respuestas
                            onOpenLatex();
                          }}
                          aria-label="Abrir ayuda LaTeX para Placeholders"
                        >
                          ?
                        </Button>
                      </Flex>
                      {/* Campo LaTeX para respuestas separadas por coma */}
                      <Flex align="center" gap={2} flex="1">
                        {card.isEditingResponses ? (
                          <Input
                            placeholder="Respuestas separadas por coma"
                            value={card.respuestas || ''}
                            onChange={(e) =>
                              setCards((prevCards) =>
                                prevCards.map((c, i) =>
                                  i === index ? { ...c, respuestas: e.target.value } : c
                                )
                              )
                            }
                            onBlur={() =>
                              setCards((prevCards) =>
                                prevCards.map((c, i) =>
                                  i === index ? { ...c, isEditingResponses: false } : c
                                )
                              )
                            }
                            bg="white"
                            fontSize="sm"
                            color="black"
                            flex="1"
                          />
                        ) : (
                          <Box
                            bg="white"
                            borderWidth="1px"
                            borderRadius="md"
                            px={3}
                            py={2}
                            cursor="pointer"
                            flex="1"
                            onClick={() =>
                              setCards((prevCards) =>
                                prevCards.map((c, i) =>
                                  i === index ? { ...c, isEditingResponses: true } : c
                                )
                              )
                            }
                          >
                            {card.respuestas ? (
                              <MathJax>{`\\(${card.respuestas}\\)`}</MathJax>
                            ) : (
                              <Text color="gray.500" fontSize="sm">
                                Haz clic para agregar expresión
                              </Text>
                            )}
                          </Box>
                        )}
                        {/* Botón para abrir el modal de ayuda LaTeX para respuestas */}
                        <Button
                          size="xs"
                          onClick={() => {
                            setCurrentCardIndex(index);
                            setIsBlankActive(false);
                            setActiveAlternativeIndex(null);
                            setActiveHintIndex(null);
                            setIsPlaceholderActive(false);
                            setIsResponseActive(true); // Activa el estado de respuestas
                            onOpenLatex();
                          }}
                          aria-label="Abrir ayuda LaTeX para Respuestas"
                        >
                          ?
                        </Button>
                      </Flex>
                    </Flex>
                    <Select
                      placeholder="Seleccione un método corrección"
                      value={card.metodoCorreccion || ''}
                      onChange={(e) =>
                        setCards((prevCards) =>
                          prevCards.map((c, i) =>
                            i === index ? { ...c, metodoCorreccion: e.target.value } : c
                          )
                        )
                      }
                      bg="white"
                      mt={2}
                    >
                      <option value="StringComparison">StringComparison</option>
                      <option value="EvaluateandCount">EvaluateandCount</option>
                      <option value="Evaluate">Evaluate</option>
                    </Select>
                  </Box>
                  </>
                ) : card.type === 'verdadero/falso' ? (
                  <>
                    <Box mb={4}  p={4} bg="yellow.300" borderRadius="md" boxShadow="md">
                      <Text fontWeight="bold">Verdadero/Falso</Text>
                      <Flex align="center" mb={4}>
                        <Button
                          colorScheme={card.trueOption ? 'green' : 'gray'}
                          onClick={() => handleTrueFalseChange(index, 'trueOption')}
                          mr={2} mt={4}
                        >
                          Verdadero
                        </Button>
                        <Button
                          colorScheme={card.falseOption ? 'red' : 'gray'}
                          onClick={() => handleTrueFalseChange(index, 'falseOption')}
                          mt={4}
                        >
                          Falso
                        </Button>
                      </Flex>
                    </Box>
                  </>
                ) : (
                  <>
                  <Box mb={4} p={4} bg="yellow.300" borderRadius="md" boxShadow="md">
                    <Text fontWeight="bold" mb={2}>Alternativas</Text>
                    {card.alternatives.map((alt, altIndex) => (
                      <Flex key={altIndex} align="start" mb={4}>
                        {/* Contenedor para los campos de texto */}
                        <Box flex="1">
                          {/* Campo de texto para la alternativa */}
                          <Input
                            id={`card-alternative-${index}-${altIndex}`}
                            placeholder={`Alternativa ${altIndex + 1}`}
                            bg="white"
                            mb={2}
                          />
                          {/* Campo para ingresar expresión LaTeX */}
                          <Flex align="center" gap={2}>
                            {alt.isEditing ? (
                              <Input
                                placeholder="Expresión LaTeX"
                                value={alt.latex || ''}
                                onChange={(e) => updateAlternative(index, altIndex, { latex: e.target.value })}
                                onBlur={() => updateAlternative(index, altIndex, { isEditing: false })}
                                bg="white"
                                fontSize="sm"
                                color="black"
                                flex="1"
                              />
                            ) : (
                              <Box
                                bg="white"
                                borderWidth="1px"
                                borderRadius="md"
                                px={3}
                                py={2}
                                cursor="pointer"
                                flex="1"
                                onClick={() => updateAlternative(index, altIndex, { isEditing: true })}
                              >
                                {alt.latex ? (
                                  <MathJax>{`\\(${alt.latex}\\)`}</MathJax>
                                ) : (
                                  <Text color="gray.500" fontSize="sm">Haz clic para agregar expresión</Text>
                                )}
                              </Box>
                            )}
                            {/* Botón para abrir el modal de ayuda LaTeX */}
                            <Button
                              size="xs"
                              onClick={() => {
                                setCurrentCardIndex(index);
                                setActiveAlternativeIndex(altIndex); // Marca la alternativa activa
                                setActiveHintIndex(null); // Limpia cualquier pista activa
                                onOpenLatex(); // Abre el modal
                              }}
                              aria-label="Abrir ayuda LaTeX para alternativa"
                            >
                              ?
                            </Button>
                          </Flex>
                        </Box>
                        {/* Contenedor para Checkbox y Botón de eliminar */}
                        <Flex direction="column" align="center" justify="center" ml={4}>
                          {/* Checkbox para marcar como correcta */}
                          <Checkbox
                            isChecked={alt.correct}
                            onChange={() => handleCorrectChange(index, altIndex)}
                            mb={2}
                          >
                            Correcta
                          </Checkbox>
                          {/* Botón para eliminar la alternativa */}
                          {card.alternatives.length > 2 && (
                            <Button
                              colorScheme="red"
                              size="sm"
                              onClick={() => removeAlternative(index, altIndex)}
                            >
                              🗑️
                            </Button>
                          )}
                        </Flex>
                      </Flex>
                    ))}
                    {/* Botón para agregar una nueva alternativa */}
                    <Button mt={4} onClick={() => addAlternative(index)}>Agregar alternativa</Button>
                  </Box>
                  </>
                )}
              </Box>
              {card.type !== 'enunciado' && (
                <Box flex="1" w="100%">
                <Box mb={4} p={4} bg="orange.300" borderRadius="md" boxShadow="md">
                  <Text fontWeight="bold" mb={2}>Pistas</Text>
                  {card.hints.map((hint, hintIndex) => (
                    <Flex key={hintIndex} direction="row" align="center" mb={4}>
                      {/* Contenedor de los campos */}
                      <Box flex="1" pr={4}>
                        {/* Campo de texto para la pista */}
                        <Input
                          id={`card-hint-${index}-${hintIndex}`}
                          placeholder={`Pista ${hintIndex + 1}`}
                          bg="white"
                          mb={2}
                        />
                        {/* Campo para ingresar expresión LaTeX */}
                        <Flex align="center" gap={2}>
                          {hint.isEditing ? (
                            <Input
                              placeholder="Expresión LaTeX"
                              value={hint.latex || ''}
                              onChange={(e) => updateHint(index, hintIndex, { latex: e.target.value })}
                              onBlur={() => updateHint(index, hintIndex, { isEditing: false })}
                              bg="white"
                              fontSize="sm"
                              color="black"
                              flex="1" // Ajusta el tamaño para que el diseño sea ordenado
                            />
                          ) : (
                            <Box
                              bg="white"
                              borderWidth="1px"
                              borderRadius="md"
                              px={3}
                              py={2}
                              cursor="pointer"
                              flex="1" // Ajusta el tamaño para que el diseño sea ordenado
                              onClick={() => updateHint(index, hintIndex, { isEditing: true })}
                            >
                              {hint.latex ? (
                                <MathJax>{`\\(${hint.latex}\\)`}</MathJax>
                              ) : (
                                <Text color="gray.500" fontSize="sm">Haz clic para agregar expresión</Text>
                              )}
                            </Box>
                          )}
                          {/* Botón para abrir el modal de ayuda LaTeX */}
                          <Button
                            size="xs"
                            onClick={() => {
                              setCurrentCardIndex(index);
                              setActiveHintIndex(hintIndex); // Estado para identificar la pista activa
                              onOpenLatex(); // Reutiliza el modal existente
                            }}
                            aria-label="Abrir ayuda LaTeX"
                          >
                            ?
                          </Button>
                        </Flex>
                      </Box>
                      {/* Botón de eliminar, tamaño fijo */}
                      <Box>
                        {card.hints.length > 2 && (
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => removeHints(index, hintIndex)}
                            h="40px" /* Altura fija */
                            w="40px" /* Ancho fijo */
                            display="flex"
                            alignItems="center"
                            justifyContent="center" /* Centralizado */
                          >
                            🗑️
                          </Button>
                        )}
                      </Box>
                    </Flex>
                  ))}
                  <Button mt={4} onClick={() => addHints(index)}>Agregar pista</Button>
                </Box>            
                      {/* Demas imputs */}
                      <Input
                        id={`card-summary-${index}`}
                        placeholder="Resumen del paso"
                        bg="white"
                        mb={4}
                      />
                      <Input
                        id={`card-succes-message-${index}`}
                        placeholder="Mensaje de éxito"
                        bg="white"
                        mb={4}
                      />
                      <Input
                        id={`card-kcs-${index}`}
                        placeholder="Kc's del ejercicio"
                        bg="white"
                        mb={4}
                      />
                      </Box>
)}
              {/* Botón de Eliminar */}
              {card.type !== 'enunciado' && (
                <Flex justifyContent="center" >
                  <Button onClick={() => deleteCard(index)} colorScheme="red" size="sm">
                    Eliminar paso
                  </Button>
                </Flex>
)}
            </Flex>
          ))}
          <Stack spacing={4} mt={4} direction="row" align="center">
            <Button onClick={() => { setActiveModal('modal1'); onOpen(); }} alignSelf="center">Agregar tarjeta</Button>
            <Button
  colorScheme="green"
  onClick={() => {
    cards.length <= 1
      ? toast({
          title: "Error",
          description: "No puedes guardar sin tener pasos en el ejercicio",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      : (setActiveModal('modal2'), onOpen());
  }}
  alignSelf="center"
>
  Guardar Ejercicio
</Button>
          </Stack>
          <Modal isOpen={isOpen && activeModal === 'modal1'} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Seleccionar tipo de tarjeta</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Select value={newCardType} onChange={(e) => setNewCardType(e.target.value)}>
                  <option value="alternativas">Paso de alternativas</option>
                  <option value="verdadero/falso">Paso de verdadero/falso</option>
                  <option value="blank">Paso de blank</option>
                  <option value="multipleplaceholder">Paso de placeholders</option>
                  <option value="table">Paso de tabla de verdad</option>
                </Select> 
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={addCard}>Agregar</Button>
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal isOpen={isOpen && activeModal === 'modal2'} onClose={onClose}>
            <ModalOverlay />
            <ModalContent width="80%" maxWidth="800px">
              <ModalHeader>Rellene los campos solicitados</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={3}>
                  <Flex align="center">
                    <Text width="200px">Nombre Del Ejercicio:</Text>
                    <Input 
                      placeholder="Nombre Del Ejercicio" 
                    />
                  </Flex>
                  <Flex align="center">
                    <Text width="200px">Código Del Ejercicio:</Text>
                    <Input 
                      placeholder="Código Del Ejercicio" 
                    />
                  </Flex>
                  <Flex align="center">
                    <Text width="200px">Tópico del Ejercicio:</Text>
                    <Select 
                      placeholder="Seleccione un Tópico" 
                      value={tempExerciseTopic} 
                    >
                      <option value="Factorización">Factorización</option>
                      <option value="Lógica y Conjuntos">Lógica y Conjuntos</option>
                      <option value="Productos Notables">Productos Notables</option>
                    </Select>
                  </Flex>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSave}>
                  Guardar
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* Modal de ayuda con LaTeX (INICIO) */}
          <Modal isOpen={isLatexOpen} onClose={onLatexClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Ayuda con LaTeX</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {currentCardIndex !== null && (
                  <>
                    <Input
                      id={`latex-input-${currentCardIndex}-${
                        activeAlternativeIndex !== null
                          ? `alternative-${activeAlternativeIndex}`
                          : activeHintIndex !== null
                          ? `hint-${activeHintIndex}`
                          : isBlankActive
                          ? 'blank'
                          : isPlaceholderActive
                          ? 'placeholder'
                          : isResponseActive
                          ? 'response'
                          : 'enunciado'
                      }`}
                      value={
                        activeAlternativeIndex !== null
                          ? cards[currentCardIndex]?.alternatives[activeAlternativeIndex]?.latex || ''
                          : activeHintIndex !== null
                          ? cards[currentCardIndex]?.hints[activeHintIndex]?.latex || ''
                          : isBlankActive
                          ? cards[currentCardIndex]?.blank || ''
                          : isPlaceholderActive
                          ? cards[currentCardIndex]?.placeholders || ''
                          : isResponseActive
                          ? cards[currentCardIndex]?.respuestas || ''
                          : cards[currentCardIndex]?.latex || ''
                      }
                      onChange={(e) =>
                        activeAlternativeIndex !== null
                          ? updateAlternative(currentCardIndex, activeAlternativeIndex, { latex: e.target.value })
                          : activeHintIndex !== null
                          ? updateHint(currentCardIndex, activeHintIndex, { latex: e.target.value })
                          : isBlankActive
                          ? updateCard(currentCardIndex, { blank: e.target.value })
                          : isPlaceholderActive
                          ? updateCard(currentCardIndex, { placeholders: e.target.value })
                          : isResponseActive
                          ? updateCard(currentCardIndex, { respuestas: e.target.value })
                          : updateCard(currentCardIndex, { latex: e.target.value })
                      }
                      mb={3}
                    />
                    {/* Botones para insertar comandos LaTeX */}
                    <Flex wrap="wrap" gap={2}>
                      {operations.map(({ label, command }, opIndex) => (
                        <Button key={opIndex} onClick={() => insertLatex(command)} size="sm">
                          <MathJax dynamic inline>{`\\(${label}\\)`}</MathJax>
                        </Button>
                      ))}
                    </Flex>
                    {/* Vista previa de LaTeX */}
                    <Box mt={4} p={2} borderWidth="1px" borderRadius="md">
                      <MathJax hideUntilTypeset="first" dynamic>
                        {`\\(${
                          activeAlternativeIndex !== null
                            ? cards[currentCardIndex]?.alternatives[activeAlternativeIndex]?.latex || 'Expresión'
                            : activeHintIndex !== null
                            ? cards[currentCardIndex]?.hints[activeHintIndex]?.latex || 'Expresión'
                            : isBlankActive
                            ? cards[currentCardIndex]?.blank || 'Expresión'
                            : isPlaceholderActive
                            ? cards[currentCardIndex]?.placeholders || 'Expresión'
                            : isResponseActive
                            ? cards[currentCardIndex]?.respuestas || 'Expresión'
                            : cards[currentCardIndex]?.latex || 'Expresión'
                        }\\)`}
                      </MathJax>
                    </Box>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    onLatexClose();
                    setActiveAlternativeIndex(null); // Limpia la alternativa activa
                    setActiveHintIndex(null); // Limpia la pista activa
                    setIsBlankActive(false); // Limpia el estado de Blank
                    setIsPlaceholderActive(false); // Limpia el estado de Placeholders
                    setIsResponseActive(false); // Limpia el estado de Respuestas
                  }}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* Modal de ayuda con LaTeX (FIN) */}

        </Flex>
      </div>
    </MathJaxContext>
  );
}
