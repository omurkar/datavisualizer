import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  // Database connection info
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '3306',
    user: '',
    password: '',
    database: '',
  });

  // Raw extracted data
  const [rawData, setRawData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tableName, setTableName] = useState('');
  const [tables, setTables] = useState([]);

  // Cleaned data
  const [cleanData, setCleanData] = useState(null);
  const [trashData, setTrashData] = useState(null);
  const [edaSummary, setEdaSummary] = useState(null);
  const [geminiValidation, setGeminiValidation] = useState(null);

  // Chart configurations (accumulated from customization page)
  const [chartConfigs, setChartConfigs] = useState([]);

  // Dashboard settings
  const [dashboardSettings, setDashboardSettings] = useState({
    colorTheme: 'purple', // purple, ocean, sunset
    gridCols: 2,
  });

  // Add a new chart config
  const addChartConfig = (config) => {
    setChartConfigs(prev => [...prev, config]);
  };

  // Reset chart configs
  const resetChartConfigs = () => {
    setChartConfigs([]);
  };

  const resetAll = () => {
    setRawData(null);
    setColumns([]);
    setTableName('');
    setTables([]);
    setCleanData(null);
    setTrashData(null);
    setEdaSummary(null);
    setGeminiValidation(null);
    setChartConfigs([]);
    setDashboardSettings({ colorTheme: 'purple', gridCols: 2 });
  };

  const value = {
    dbConfig, setDbConfig,
    rawData, setRawData,
    columns, setColumns,
    tableName, setTableName,
    tables, setTables,
    cleanData, setCleanData,
    trashData, setTrashData,
    edaSummary, setEdaSummary,
    geminiValidation, setGeminiValidation,
    chartConfigs, setChartConfigs, addChartConfig, resetChartConfigs,
    dashboardSettings, setDashboardSettings,
    resetAll,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
