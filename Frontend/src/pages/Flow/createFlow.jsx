import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Clear, Send, Add, TextFields, Image, Edit, CheckBox, RadioButtonChecked, ArrowDropDown, CheckCircle, ShortText, Subject, CalendarToday } from '@mui/icons-material';
import Sidebar from '../../component/sidebar';
import Header from '../../component/header';
import FlowPreview from '../../component/Flow/FlowPreview';
import SortableScreen from '../../component/Flow/SortableScreen';
import SortableComponent from '../../component/Flow/SortableComponent';
import useFlowStore from '../../app/flowStore';

const CreateFlow = () => {
  const location = useLocation();
  const flow = location.state?.flow || null;

  const {
    flowName,
    description,
    language,
    status,
    screens,
    error,
    currentPreviewScreen,
    selectedScreenIndex,
    sidebarOpen,
    userDropdownOpen,
    activeNavItem,
    setFlowName,
    setDescription,
    setLanguage,
    setStatus,
    setScreens,
    setCurrentPreviewScreen,
    setSelectedScreenIndex,
    toggleSidebar,
    toggleUserDropdown,
    setActiveNavItem,
    addScreen,
    removeScreen,
    updateScreen,
    addComponent,
    removeComponent,
    updateComponent,
    addOption,
    updateOption,
    removeOption,
    clear,
    validateAndSubmit,
    handleDragEnd,
  } = useFlowStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
    if (window.innerWidth < 768) toggleSidebar();
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const componentOptions = {
    Text: [
      { value: 'text_heading', label: 'Large Heading', icon: <TextFields style={{ fontSize: '16px' }} /> },
      { value: 'text_subheading', label: 'Small Heading', icon: <TextFields style={{ fontSize: '16px' }} /> },
      { value: 'text_body', label: 'Body', icon: <TextFields style={{ fontSize: '16px' }} /> },
      { value: 'text_caption', label: 'Caption', icon: <TextFields style={{ fontSize: '16px' }} /> },
    ],
    Media: [
      { value: 'image', label: 'Image', icon: <Image style={{ fontSize: '16px' }} /> },
    ],
    'Text Answer': [
      { value: 'text_input', label: 'Short Answer', icon: <ShortText style={{ fontSize: '16px' }} /> },
      { value: 'textarea', label: 'Paragraph', icon: <Subject style={{ fontSize: '16px' }} /> },
      { value: 'date_picker', label: 'Date Picker', icon: <CalendarToday style={{ fontSize: '16px' }} /> },
    ],
    Selection: [
      { value: 'radio', label: 'Single Choice', icon: <RadioButtonChecked style={{ fontSize: '16px' }} /> },
      { value: 'checkbox', label: 'Multiple Choice', icon: <CheckBox style={{ fontSize: '16px' }} /> },
      { value: 'dropdown', label: 'Dropdown', icon: <ArrowDropDown style={{ fontSize: '16px' }} /> },
      { value: 'opt_in', label: 'Opt-in', icon: <CheckCircle style={{ fontSize: '16px' }} /> },
    ],
  };

  const handleComponentSelect = (type) => {
    addComponent(selectedScreenIndex, type);
    setIsDropdownOpen(false);
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (flow) {
      setFlowName(flow.name || '');
      setDescription(flow.description || '');
      setLanguage(flow.language || 'en_US');
      setStatus(flow.status || 'DRAFT');
      setScreens(flow.screens || []);
    }
    if (!activeNavItem) {
      console.warn('activeNavItem is undefined or empty, resetting to default');
      setActiveNavItem('create flow');
    }
  }, [flow, setFlowName, setDescription, setLanguage, setStatus, setScreens, activeNavItem, setActiveNavItem]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={toggleSidebar}
          activeNavItem={activeNavItem}
          handleNavItemClick={handleNavItemClick}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            activeNavItem={activeNavItem}
            toggleSidebar={toggleSidebar}
            userDropdownOpen={userDropdownOpen}
            toggleUserDropdown={toggleUserDropdown}
          />
          <main className="flex-1 overflow-y-auto bg-[#dde9f0] p-6">
            <div className="max-w-7xl mx-auto h-[calc(100%-48px)]">
              <div className="flex gap-4 h-full">
                <div className="w-[250px] bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Screens</h3>
                    <button
                      onClick={addScreen}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-1 text-sm"
                      aria-label="Add new screen"
                    >
                      <Add style={{ fontSize: '16px' }} /> Add
                    </button>
                  </div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginBottom: '8px',
                      fontWeight: '400',
                    }}
                    id="screens-help"
                  >
                    Add and manage screens for your WhatsApp Flow. Each screen represents a step in the user interaction.
                  </p>
                  <SortableContext items={screens.map(screen => screen.id)} strategy={verticalListSortingStrategy}>
                    {screens.map((screen, index) => (
                      <SortableScreen
                        key={screen.id}
                        screen={screen}
                        index={index}
                        selectedScreenIndex={selectedScreenIndex}
                        setSelectedScreenIndex={setSelectedScreenIndex}
                        setCurrentPreviewScreen={setCurrentPreviewScreen}
                        handleRemoveScreen={removeScreen}
                      />
                    ))}
                  </SortableContext>
                </div>
                <div className="flex-1 flex gap-4">
                  <div className="flex-1 bg-white rounded-lg shadow-md p-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      {flow ? 'Edit WhatsApp Flow' : 'Create WhatsApp Flow'}
                    </h2>
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm font-medium">
                        {error}
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200">
                        Flow Metadata
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Flow Name
                          </label>
                          <input
                            type="text"
                            value={flowName}
                            onChange={(e) => setFlowName(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-white"
                            placeholder="e.g., customer_survey"
                            aria-label="Enter flow name"
                            aria-describedby={error && !flowName ? 'flow-name-error' : 'flow-name-help'}
                            aria-invalid={!!(error && !flowName)}
                          />
                          <p
                            id="flow-name-help"
                            style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              marginTop: '8px',
                              fontWeight: '400',
                            }}
                          >
                            Enter a unique name for the flow (e.g., customer_survey). Use lowercase letters, numbers, or underscores. Required.
                          </p>
                          {error && !flowName && (
                            <p
                              id="flow-name-error"
                              style={{
                                fontSize: '0.75rem',
                                color: '#DC2626',
                                marginTop: '4px',
                                fontWeight: '400',
                              }}
                            >
                              {error}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Language
                          </label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-white"
                            aria-label="Select flow language"
                            aria-describedby="language-help"
                          >
                            <option value="en_US">English (US)</option>
                            <option value="es_ES">Spanish (Spain)</option>
                            <option value="fr_FR">French (France)</option>
                            <option value="hi_IN">Hindi (India)</option>
                          </select>
                          <p
                            id="language-help"
                            style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              marginTop: '8px',
                              fontWeight: '400',
                            }}
                          >
                            Select the language for the flow content (e.g., English (US)). Required.
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Description
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-md text-sm min-h-[80px] bg-white"
                          placeholder="Internal notes about the flow"
                          aria-label="Enter flow description"
                          aria-describedby="description-help"
                        />
                        <p
                          id="description-help"
                          style={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            marginTop: '8px',
                            fontWeight: '400',
                          }}
                        >
                          Enter internal notes describing the flow's purpose (e.g., "Survey for customer feedback"). Optional.
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Status:</label>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
                            ${status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-200 text-gray-700'}`}
                        >
                          {status}
                        </span>
                      </div>
                      <p
                        id="status-help"
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '8px',
                          fontWeight: '400',
                        }}
                      >
                        Displays the current status of the flow (e.g., DRAFT, SUBMITTED, APPROVED, or REJECTED).
                      </p>
                      {flow && (
                        <div className="mt-3 text-sm text-gray-700">
                          <p>Created: {flow.createdAt || 'N/A'}</p>
                          <p>Last Modified: {flow.updatedAt || 'N/A'}</p>
                        </div>
                      )}
                    </div>
                    {screens[selectedScreenIndex] && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200">
                          Edit Screen: {screens[selectedScreenIndex].title || `Screen ${selectedScreenIndex + 1}`}
                        </h3>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Screen Title
                          </label>
                          <input
                            type="text"
                            value={screens[selectedScreenIndex].title}
                            onChange={(e) => updateScreen(selectedScreenIndex, 'title', e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-white"
                            placeholder="e.g., Welcome Screen"
                            aria-label="Enter screen title"
                            aria-describedby="screen-title-help"
                          />
                          <p
                            id="screen-title-help"
                            style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              marginTop: '8px',
                              fontWeight: '400',
                            }}
                          >
                            Enter a title for the screen (e.g., Welcome Screen). This helps identify the screen's purpose. Required.
                          </p>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Instruction
                          </label>
                          <textarea
                            value={screens[selectedScreenIndex].instruction || ''}
                            onChange={(e) => updateScreen(selectedScreenIndex, 'instruction', e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm min-h-[80px] bg-white"
                            placeholder="Enter instruction text"
                            aria-label="Enter screen instruction"
                            aria-describedby="screen-instruction-help"
                          />
                          <p
                            id="screen-instruction-help"
                            style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              marginTop: '8px',
                              fontWeight: '400',
                            }}
                          >
                            Provide guidance or context for the screen (e.g., "Please provide your details"). Optional.
                          </p>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Components
                          </label>
                          <div className="relative">
                            <button
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors flex items-center gap-1 w-full"
                              aria-label="Add new component"
                            >
                              <Add style={{ fontSize: '16px' }} /> Add Component
                            </button>
                            <p
                              id="components-help"
                              style={{
                                fontSize: '0.75rem',
                                color: '#6B7280',
                                marginTop: '8px',
                                fontWeight: '400',
                              }}
                            >
                              Add components like text, media, or interactive elements to build the screen's content.
                            </p>
                            {isDropdownOpen && (
                              <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md py-1">
                                {Object.keys(componentOptions).map((category) => (
                                  <div key={category} className="relative">
                                    <button
                                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                      aria-label={`Toggle ${category} components`}
                                    >
                                      {category === 'Text' && <TextFields style={{ fontSize: '16px' }} />}
                                      {category === 'Media' && <Image style={{ fontSize: '16px' }} />}
                                      {category === 'Text Answer' && <Edit style={{ fontSize: '16px' }} />}
                                      {category === 'Selection' && <CheckBox style={{ fontSize: '16px' }} />}
                                      {category}
                                    </button>
                                    {selectedCategory === category && (
                                      <div className="pl-4">
                                        {componentOptions[category].map((option) => (
                                          <button
                                            key={option.value}
                                            onClick={() => handleComponentSelect(option.value)}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                                            aria-label={`Add ${option.label} component`}
                                          >
                                            {option.icon}
                                            {option.label}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <SortableContext
                          items={screens[selectedScreenIndex].components.map(comp => comp.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {screens[selectedScreenIndex].components.map((comp, compIndex) => (
                            <SortableComponent
                              key={comp.id}
                              comp={comp}
                              compIndex={compIndex}
                              screenIndex={selectedScreenIndex}
                              handleRemoveComponent={removeComponent}
                              handleComponentChange={updateComponent}
                              handleAddOption={addOption}
                              handleOptionFieldChange={updateOption}
                              handleRemoveOption={removeOption}
                            />
                          ))}
                        </SortableContext>
                      </div>
                    )}
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={clear}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm"
                        aria-label="Clear form"
                      >
                        <Clear style={{ fontSize: '16px', verticalAlign: 'middle' }} /> Clear
                      </button>
                      <button
                        onClick={validateAndSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1"
                        aria-label="Submit flow"
                      >
                        <Send style={{ fontSize: '16px', verticalAlign: 'middle' }} /> Submit
                      </button>
                    </div>
                  </div>
                  <FlowPreview
                    screens={screens}
                    currentPreviewScreen={currentPreviewScreen}
                    setCurrentPreviewScreen={setCurrentPreviewScreen}
                    handleSubmit={validateAndSubmit}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </DndContext>
  );
};

export default CreateFlow;