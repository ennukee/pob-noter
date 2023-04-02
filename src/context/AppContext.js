import React, { createContext, useReducer } from 'react';
export const AppContext = createContext();

const initialState = {'1': '7070ff', '2': 'e05030', '3': '70ff70'};
function reducer(state, action) {
  switch (action.type) {
    case 'SET_COLOR':
      const existingBind = Object.entries(state).find(pair => pair[1] === action.color)
      if (existingBind) {
        const newState = {
          ...state,
          [existingBind[0]]: '',
          [action.key]: action.color,
        }
        localStorage.setItem('colorHotkeys', JSON.stringify(newState))
        return newState
      }
      const newState = {
        ...state,
        [action.key]: action.color,
      };
      localStorage.setItem('colorHotkeys', JSON.stringify(newState))
      return newState;
    default:
      return state;
  }
}

export const AppContextProvider = ({ children }) => {
  const [colorMap, dispatch] = useReducer(reducer, JSON.parse(localStorage.getItem('colorHotkeys')) || initialState);
  
  const setColor = (key, color) => {
    dispatch({ type: 'SET_COLOR', key, color })
  }

  const getColor = (key) => {
    return colorMap[key]
  }

  const checkColorForKey = (color) => {
    return Object.entries(colorMap).find(pair => pair[1] === color)?.[0].toUpperCase()
  }

  const value = {
    setColor, getColor, checkColorForKey
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};