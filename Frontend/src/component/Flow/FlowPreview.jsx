import React, { useState, useEffect } from 'react';
import useFlowStore from '../../app/flowStore';

const PhoneFrame = ({ children }) => (
  <div className="relative w-full max-w-[300px] aspect-[375/600] mx-auto border-[12px] border-black rounded-[48px] bg-black overflow-hidden shadow-2xl max-h-[500px]">
    <div className="absolute top-0 left-0 w-full h-8 bg-black text-white flex items-center justify-center text-xs">
      <span className="absolute left-4">9:41</span>
      <span className="absolute right-4">Battery</span>
    </div>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[20px] bg-black rounded-b-xl"></div>
    <div className="phone-frame-content relative top-8 h-[calc(100%-52px)] bg-white overflow-y-auto">
      {children}
    </div>
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[90px] h-1 bg-white rounded-full"></div>
  </div>
);

const FlowPreview = ({ screens, currentPreviewScreen, setCurrentPreviewScreen }) => {
  const { validateAndSubmit } = useFlowStore();
  const [previewInputs, setPreviewInputs] = useState({});
  const [previewErrors, setPreviewErrors] = useState({});

  useEffect(() => {
    setPreviewInputs({});
    setPreviewErrors({});
  }, [currentPreviewScreen]);

  const validateInput = (compId, value, comp) => {
    let error = '';
    const inputType = comp.inputType || 'text';

    if (comp.required && !value.trim()) {
      error = 'This field is required.';
    } else if (inputType === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address.';
    } else if (inputType === 'phone' && value) {
      if (!/^\+?[1-9]\d{0,15}$/.test(value.replace(/[\s\-()]/g, ''))) {
        error = comp.patternErrorText || 'Please enter a valid phone number.';
      } else if (comp.pattern && !new RegExp(comp.pattern).test(value)) {
        error = comp.patternErrorText || 'Phone number does not match expected format.';
      }
    } else if (inputType === 'number' && value) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        error = 'Please enter a valid number.';
      } else if (comp.minLength && num < parseInt(comp.minLength)) {
        error = `Value must be at least ${comp.minLength}.`;
      } else if (comp.maxLength && num > parseInt(comp.maxLength)) {
        error = `Value must be at most ${comp.maxLength}.`;
      }
    } else if (inputType === 'passcode' && value && !/^\d{4,6}$/.test(value)) {
      error = 'Passcode must be 4-6 digits.';
    } else if (comp.pattern && value && !new RegExp(comp.pattern).test(value)) {
      error = comp.patternErrorText || 'Invalid format.';
    }

    return error;
  };

  const handleTextInputChange = (compId, value, comp) => {
    setPreviewInputs((prev) => ({
      ...prev,
      [compId]: value,
    }));
    const error = validateInput(compId, value, comp);
    setPreviewErrors((prev) => ({
      ...prev,
      [compId]: error,
    }));
  };

  const handleRadioChange = (compId, value) => {
    setPreviewInputs((prev) => ({
      ...prev,
      [compId]: value,
    }));
  };

  const handleCheckboxChange = (compId, value, checked) => {
    setPreviewInputs((prev) => {
      const currentValues = prev[compId] || [];
      if (checked) {
        return { ...prev, [compId]: [...currentValues, value] };
      } else {
        return { ...prev, [compId]: currentValues.filter((v) => v !== value) };
      }
    });
  };

  const handleDropdownChange = (compId, value) => {
    setPreviewInputs((prev) => ({
      ...prev,
      [compId]: value,
    }));
  };

  const handleOptInChange = (compId, checked) => {
    setPreviewInputs((prev) => ({
      ...prev,
      [compId]: checked,
    }));
  };

  const handleDateChange = (compId, value) => {
    setPreviewInputs((prev) => ({
      ...prev,
      [compId]: value,
    }));
  };

  const renderPreview = () => {
    if (screens.length === 0) {
      return (
        <div className="text-center text-gray-500 p-5 h-full flex items-center justify-center">
          No screens to preview
        </div>
      );
    }
    const screen = screens[currentPreviewScreen];
    return (
      <PhoneFrame>
        <div className="p-4 w-full h-full flex flex-col">
          <div className="mb-4 flex-1 overflow-y-auto">
            {screen.title && (
              <div className="text-gray-800 text-sm font-semibold p-2 rounded-t-lg break-words">
                {screen.title}
              </div>
            )}
            {screen.instruction && (
              <div className="text-gray-700 text-sm p-2 rounded-b-lg mb-2 break-words">
                {screen.instruction}
              </div>
            )}
            {screen.components.map((comp, index) => {
              switch (comp.type) {
                case 'text_heading':
                  return (
                    <div key={index} className="text-green-800 text-base font-bold p-2 rounded-lg mb-2 break-words">
                      {comp.text || 'Enter heading'}
                    </div>
                  );
                case 'text_subheading':
                  return (
                    <div key={index} className="text-gray-700 text-sm font-semibold p-2 rounded-lg mb-2 break-words">
                      {comp.text || 'Enter subheading'}
                    </div>
                  );
                case 'text_body':
                  {
                    const bodyStyle = {
                      textDecoration: comp.strikethrough ? 'line-through' : 'none',
                    };
                    return (
                      <div key={index} className="text-gray-700 text-sm p-2 rounded-lg mb-2 break-words" style={bodyStyle}>
                        {comp.text || 'Enter body text'}
                      </div>
                    );
                  }
                case 'text_caption':
                  {
                    const captionStyle = {
                      textDecoration: comp.strikethrough ? 'line-through' : 'none',
                    };
                    return (
                      <div key={index} className="text-gray-500 text-xs p-2 rounded-lg mb-2 break-words" style={captionStyle}>
                        {comp.text || 'Enter caption'}
                      </div>
                    );
                  }
                case 'image':
                  if (!comp.previewUrl && !comp.url) {
                    return (
                      <div key={index} className="w-full h-32 bg-gray-200 flex items-center justify-center mb-2 rounded text-gray-500">
                        Add Image
                      </div>
                    );
                  }
                  return (
                    <img
                      key={index}
                      src={comp.previewUrl || comp.url}
                      alt={comp.altText || 'Image'}
                      className="w-full mb-2 rounded-lg object-contain"
                    />
                  );
                case 'embedded_link':
                  return (
                    <a
                      key={index}
                      href={comp.url || '#'}
                      className="bg-green-100 text-blue-600 underline p-2 rounded-lg mb-2 block break-words"
                    >
                      {comp.text || 'Enter link text'}
                    </a>
                  );
                case 'text_input':
                  return (
                    <div key={index} className="p-2 rounded-lg mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                        {comp.label || 'Label'}
                        {comp.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={comp.inputType === 'passcode' ? 'password' : comp.inputType || 'text'}
                        value={previewInputs[comp.id] || comp.defaultText || ''}
                        onChange={(e) => handleTextInputChange(comp.id, e.target.value, comp)}
                        onBlur={(e) => {
                          const error = validateInput(comp.id, e.target.value, comp);
                          setPreviewErrors((prev) => ({ ...prev, [comp.id]: error }));
                        }}
                        placeholder={comp.placeholder || comp.label || 'Enter text'}
                        min={comp.minLength}
                        max={comp.maxLength}
                        pattern={comp.pattern ? comp.pattern.replace(/^\/|\/$/, '') : undefined}
                        maxLength={80}
                        className={`w-full p-2 border rounded-md text-sm ${
                          previewErrors[comp.id] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {previewErrors[comp.id] && (
                        <p className="text-xs text-red-500 mt-1 break-words">{previewErrors[comp.id]}</p>
                      )}
                      {comp.instruction && !previewErrors[comp.id] && (
                        <p className="text-xs text-gray-500 mt-1 break-words">{comp.instruction}</p>
                      )}
                    </div>
                  );
                case 'textarea':
                  return (
                    <div key={index} className="p-2 rounded-lg mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                        {comp.label || 'Label'}
                        {comp.required && <span className="text-red-500">*</span>}
                      </label>
                      <textarea
                        value={previewInputs[comp.id] || comp.defaultText || ''}
                        onChange={(e) => handleTextInputChange(comp.id, e.target.value, comp)}
                        placeholder={comp.placeholder || comp.label || 'Enter text'}
                        className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] text-sm"
                      />
                      {comp.instruction && (
                        <p className="text-xs text-gray-500 mt-1 break-words">{comp.instruction}</p>
                      )}
                    </div>
                  );
                case 'opt_in':
                  return (
                    <div key={index} className="p-2 rounded-lg mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                        <input
                          type="checkbox"
                          checked={previewInputs[comp.id] || comp.defaultChecked || false}
                          onChange={(e) => handleOptInChange(comp.id, e.target.checked)}
                          className="mr-2"
                        />
                        {comp.label || 'Opt-in'}
                        {comp.required && <span className="text-red-500">*</span>}
                      </label>
                      {comp.instruction && (
                        <p className="text-xs text-gray-500 mt-1 break-words">{comp.instruction}</p>
                      )}
                    </div>
                  );
                case 'radio':
                  return (
                    <div key={index} className="p-2 rounded-lg mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                        {comp.label || 'Single Choice'}
                        {comp.required && <span className="text-red-500">*</span>}
                      </label>
                      {comp.options.length === 0 ? (
                        <p className="text-gray-500 text-sm break-words">Add options</p>
                      ) : (
                        comp.options.map((opt, i) => (
                          <div key={i} className="mb-1">
                            <label className="block break-words">
                              <input
                                type="radio"
                                name={`radio_${comp.id}`}
                                value={opt.label}
                                checked={previewInputs[comp.id] === opt.label}
                                onChange={() => handleRadioChange(comp.id, opt.label)}
                                className="mr-2"
                              />
                              {opt.label || `Option ${i + 1}`}
                            </label>
                            {opt.description && (
                              <p className="text-xs text-gray-500 ml-6 break-words">{opt.description}</p>
                            )}
                          </div>
                        ))
                      )}
                      {comp.instruction && (
                        <p className="text-xs text-gray-500 mt-1 break-words">{comp.instruction}</p>
                      )}
                    </div>
                  );
                case 'checkbox':
                  return (
                    <div key={index} className="p-2 rounded-lg mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                        {comp.label || 'Multiple Choice'}
                        {comp.required && <span className="text-red-500">*</span>}
                      </label>
                      {comp.options.length === 0 ? (
                        <p className="text-gray-500 text-sm break-words">Add options</p>
                      ) : (
                        comp.options.map((opt, i) => (
                          <div key={i} className="mb-1">
                            <label className="block break-words">
                              <input
                                type="checkbox"
                                checked={(previewInputs[comp.id] || []).includes(opt.label)}
                                onChange={(e) =>
                                  handleCheckboxChange(comp.id, opt.label, e.target.checked)
                                }
                                className="mr-2"
                              />
                              {opt.label || `Option ${i + 1}`}
                            </label>
                            {opt.description && (
                              <p className="text-xs text-gray-500 ml-6 break-words">{opt.description}</p>
                            )}
                          </div>
                        ))
                      )}
                      {comp.instruction && (
                        <p className="text-xs text-gray-500 mt-1 break-words">{comp.instruction}</p>
                      )}
                    </div>
                  );
                case 'dropdown':
                  return (
                    <div key={index} className="p-2 rounded-lg mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                        {comp.label || 'Dropdown'}
                        {comp.required && <span className="text-red-500">*</span>}
                      </label>
                      <select
                        value={previewInputs[comp.id] || ''}
                        onChange={(e) => handleDropdownChange(comp.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Select an option</option>
                        {comp.options.length === 0 ? (
                          <option disabled>Add options</option>
                        ) : (
                          comp.options.map((opt, i) => (
                            <option key={i} value={opt.label}>
                              {opt.label || `Option ${i + 1}`}
                            </option>
                          ))
                        )}
                      </select>
                      {comp.instruction && (
                        <p className="text-xs text-gray-500 mt-1 break-words">{comp.instruction}</p>
                      )}
                    </div>
                  );
                case 'date_picker':
                  return (
                    <div key={index} className="p-2 rounded-lg mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 break-words">
                        {comp.label || 'Date Picker'}
                        {comp.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="date"
                        value={previewInputs[comp.id] || comp.defaultDate || ''}
                        onChange={(e) => handleDateChange(comp.id, e.target.value)}
                        min={comp.minDate || ''}
                        max={comp.maxDate || ''}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      />
                      {comp.instruction && (
                        <p className="text-xs text-gray-500 mt-1 break-words">{comp.instruction}</p>
                      )}
                    </div>
                  );
                case 'yes_no':
                  return (
                    <div key={index} className="flex gap-2 mb-2">
                      <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                        {comp.yesText || 'Yes'}
                      </button>
                      <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg">
                        {comp.noText || 'No'}
                      </button>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
          <div className="flex justify-between mt-4 shrink-0">
            {currentPreviewScreen > 0 && (
              <button
                onClick={() => setCurrentPreviewScreen(currentPreviewScreen - 1)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
              >
                Back
              </button>
            )}
            {currentPreviewScreen < screens.length - 1 && (
              <button
                onClick={() => setCurrentPreviewScreen(currentPreviewScreen + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Next
              </button>
            )}
            {currentPreviewScreen === screens.length - 1 && (
              <button
                onClick={validateAndSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </PhoneFrame>
    );
  };

  return (
    <div className="w-[300px] bg-gray-50 rounded-lg shadow-md p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
      {renderPreview()}
    </div>
  );
};

export default FlowPreview;