import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete, DragIndicator, Add } from '@mui/icons-material';
import useFlowStore from '../../app/flowStore';

const SortableComponent = ({ comp, compIndex, screenIndex }) => {
  const { updateComponent, removeComponent, addOption, updateOption, removeOption } = useFlowStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: comp.id,
    data: { type: 'COMPONENT', screenIndex },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [isOpen, setIsOpen] = useState(false);

  const renderComponentEditor = () => {
    if (['text_heading', 'text_subheading', 'text_body', 'text_caption'].includes(comp.type)) {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Type</label>
          <select
            value={comp.type}
            onChange={(e) => updateComponent(screenIndex, compIndex, 'type', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-sm mb-4"
            aria-label="Select text type"
            aria-describedby="text-type-help"
          >
            <option value="text_heading">Large Heading</option>
            <option value="text_subheading">Small Heading</option>
            <option value="text_body">Body</option>
            <option value="text_caption">Caption</option>
          </select>
          <p
            id="text-type-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              marginBottom: '8px',
              fontWeight: '400',
            }}
          >
            Choose the type of text component (e.g., Large Heading for prominent titles). Required.
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
          {(['text_heading', 'text_subheading'].includes(comp.type)) ? (
            <div className="relative">
              <input
                type="text"
                value={comp.text || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'text', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter text here"
                maxLength={80}
                aria-label="Enter text content"
                aria-describedby="text-content-help"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {(comp.text || '').length}/80
              </span>
              <p
                id="text-content-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter the text content for the heading (max 80 characters). Required.
              </p>
            </div>
          ) : (
            <div className="relative">
              <textarea
                value={comp.text || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'text', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter text here"
                maxLength={4096}
                aria-label="Enter text content"
                aria-describedby="text-content-help"
              />
              <span className="absolute right-3 top-2 text-xs text-gray-500">
                {(comp.text || '').length}/4096
              </span>
              <p
                id="text-content-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter the text content for the body or caption (max 4096 characters). Required.
              </p>
            </div>
          )}
        </div>
      );
    }

    switch (comp.type) {
      case 'image':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="text"
              value={comp.url || ''}
              onChange={(e) => updateComponent(screenIndex, compIndex, 'url', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white"
              placeholder="Enter image URL"
              aria-label="Enter image URL"
              aria-describedby={comp.url || comp.previewUrl ? 'image-url-help' : 'image-url-error'}
              aria-invalid={!(comp.url || comp.previewUrl)}
            />
            <p
              id="image-url-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Enter the URL of the image (e.g., https://example.com/image.jpg). Required if no file is uploaded.
            </p>
            {!(comp.url || comp.previewUrl) && (
              <p
                id="image-url-error"
                style={{
                  fontSize: '0.75rem',
                  color: '#DC2626',
                  marginTop: '4px',
                  fontWeight: '400',
                }}
              >
                An image URL or file must be provided.
              </p>
            )}
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Upload for Preview</label>
            <div className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm bg-white mb-2">
              <p>Drag and drop files</p>
              <p>Or choose file on your device</p>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    if (e.target.files[0].size <= 300000) {
                      updateComponent(screenIndex, compIndex, 'previewUrl', URL.createObjectURL(e.target.files[0]));
                    } else {
                      alert('File size must not exceed 300kb');
                    }
                  }
                }}
                className="hidden"
                id={`file-upload-${comp.id}`}
                aria-label="Upload image file"
                aria-describedby="image-upload-help"
              />
              <label htmlFor={`file-upload-${comp.id}`} className="cursor-pointer text-blue-600 underline">
                Choose JPG or PNG file
              </label>
              {!comp.previewUrl && !comp.url && (
                <div className="mt-2 text-red-600 bg-red-100 p-2 rounded-md">
                  An image must be selected
                </div>
              )}
            </div>
            <p
              id="image-upload-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Upload a JPEG or PNG image for preview (max 300kb). Required if no URL is provided.
            </p>
            <p className="text-xs text-gray-500 mb-1">Maximum file size: 300kb</p>
            <p className="text-xs text-gray-500">Acceptable file types: JPEG, PNG</p>
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Alt Text</label>
            <input
              type="text"
              value={comp.altText || ''}
              onChange={(e) => updateComponent(screenIndex, compIndex, 'altText', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white"
              placeholder="Enter alt text"
              aria-label="Enter alt text"
              aria-describedby="image-alt-text-help"
            />
            <p
              id="image-alt-text-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Provide alternative text for accessibility (e.g., "Product image"). Optional.
            </p>
          </div>
        );
      case 'embedded_link':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input
              type="text"
              value={comp.text || ''}
              onChange={(e) => updateComponent(screenIndex, compIndex, 'text', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white"
              placeholder="Enter link text"
              aria-label="Enter link text"
              aria-describedby="embedded-link-text-help"
            />
            <p
              id="embedded-link-text-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Enter the display text for the link (e.g., "Visit our website"). Required.
            </p>
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">URL</label>
            <input
              type="text"
              value={comp.url || ''}
              onChange={(e) => updateComponent(screenIndex, compIndex, 'url', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white"
              placeholder="Enter link URL"
              aria-label="Enter link URL"
              aria-describedby="embedded-link-url-help"
            />
            <p
              id="embedded-link-url-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Enter the URL for the link (e.g., https://example.com). Required.
            </p>
          </div>
        );
      case 'text_input':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Input Type</label>
            <select
              value={comp.inputType || 'text'}
              onChange={(e) => updateComponent(screenIndex, compIndex, 'inputType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-sm mb-4"
              aria-label="Select input type"
              aria-describedby="input-type-help"
            >
              <option value="text">Text</option>
              <option value="password">Password</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="passcode">Passcode</option>
              <option value="phone">Phone</option>
            </select>
            <p
              id="input-type-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                marginBottom: '8px',
                fontWeight: '400',
              }}
            >
              Select the type of input field (e.g., Text for general input, Email for email addresses). Required.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <div className="relative">
              <input
                type="text"
                value={comp.label || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'label', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter label (e.g., Email Address)"
                maxLength={20}
                aria-label="Enter input label"
                aria-describedby="input-label-help"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {(comp.label || '').length}/20
              </span>
              <p
                id="input-label-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter a label for the input field (e.g., "Email Address", max 20 characters). Required.
              </p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Placeholder</label>
            <div className="relative">
              <input
                type="text"
                value={comp.placeholder || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'placeholder', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter placeholder text (e.g., john@example.com)"
                maxLength={80}
                aria-label="Enter placeholder text"
                aria-describedby="input-placeholder-help"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {(comp.placeholder || '').length}/80
              </span>
              <p
                id="input-placeholder-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter placeholder text to guide users (e.g., "john@example.com", max 80 characters). Optional.
              </p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Instruction</label>
            <div className="relative">
              <input
                type="text"
                value={comp.instruction || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'instruction', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter instruction text (e.g., Provide a valid email)"
                maxLength={80}
                aria-label="Enter instruction text"
                aria-describedby="input-instruction-help"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {(comp.instruction || '').length}/80
              </span>
              <p
                id="input-instruction-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Provide guidance for the input (e.g., "Provide a valid email", max 80 characters). Optional.
              </p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Custom Pattern (Optional)</label>
            <input
              type="text"
              value={comp.pattern || ''}
              onChange={(e) => updateComponent(screenIndex, compIndex, 'pattern', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white"
              placeholder="e.g., ^[+]?[1-9]\\d{0,15}$ for international phone"
              aria-label="Enter custom pattern"
              aria-describedby="input-pattern-help"
            />
            <p
              id="input-pattern-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Enter a regex pattern to validate input (e.g., "^[+]?[1-9]\\d{0, 15}$" for phone numbers). Optional.
            </p>
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Pattern Error Text (Optional)</label>
            <input
              type="text"
              value={comp.patternErrorText || ''}
              onChange={(e) => updateComponent(screenIndex, compIndex, 'patternErrorText', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white"
              placeholder="e.g., Please enter a valid phone number"
              maxLength={100}
              aria-label="Enter pattern error text"
              aria-describedby="input-pattern-error-help"
            />
            <p
              id="input-pattern-error-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Enter error text to display if the pattern validation fails (max 100 characters). Optional.
            </p>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={comp.required || false}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'required', e.target.checked)}
                className="mr-2"
                aria-label="Mark input as required"
                aria-describedby="input-required-help"
              />
              Required
            </label>
            <p
              id="input-required-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Check to make this input field mandatory for users.
            </p>
            {comp.inputType === 'number' && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
                  <input
                    type="number"
                    value={comp.minLength || ''}
                    onChange={(e) => updateComponent(screenIndex, compIndex, 'minLength', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-sm"
                    aria-label="Enter minimum value"
                    aria-describedby="input-min-value-help"
                  />
                  <p
                    id="input-min-value-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Set the minimum value for number inputs (e.g., 0). Optional.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
                  <input
                    type="number"
                    value={comp.maxLength || ''}
                    onChange={(e) => updateComponent(screenIndex, compIndex, 'maxLength', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-sm"
                    aria-label="Enter maximum value"
                    aria-describedby="input-max-value-help"
                  />
                  <p
                    id="input-max-value-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Set the maximum value for number inputs (e.g., 100). Optional.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case 'textarea':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <div className="relative">
              <input
                type="text"
                value={comp.label || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'label', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter label (e.g., Name)"
                maxLength={20}
                aria-label="Enter textarea label"
                aria-describedby="textarea-label-help"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {(comp.label || '').length}/20
              </span>
              <p
                id="textarea-label-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter a label for the textarea (e.g., "Name", max 20 characters). Required.
              </p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Instruction</label>
            <div className="relative">
              <input
                type="text"
                value={comp.instruction || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'instruction', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter instruction text"
                maxLength={80}
                aria-label="Enter textarea instruction"
                aria-describedby="textarea-instruction-help"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {(comp.instruction || '').length}/80
              </span>
              <p
                id="textarea-instruction-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Provide guidance for the textarea (e.g., "Enter your feedback", max 80 characters). Optional.
              </p>
            </div>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={comp.required || false}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'required', e.target.checked)}
                className="mr-2"
                aria-label="Mark textarea as required"
                aria-describedby="textarea-required-help"
              />
              Required
            </label>
            <p
              id="textarea-required-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Check to make this textarea mandatory for users.
            </p>
          </div>
        );
      case 'opt_in':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <div className="relative">
              <textarea
                value={comp.label || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'label', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter opt-in label (e.g., Agree to terms)"
                maxLength={300}
                rows={3}
                aria-label="Enter opt-in label"
                aria-describedby="opt-in-label-help"
              />
              <span className="absolute right-3 top-2 text-xs text-gray-500">
                {(comp.label || '').length}/300
              </span>
              <p
                id="opt-in-label-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter the label for the opt-in checkbox (e.g., "Agree to terms", max 300 characters). Required.
              </p>
            </div>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={comp.required || false}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'required', e.target.checked)}
                className="mr-2"
                aria-label="Mark opt-in as required"
                aria-describedby="opt-in-required-help"
              />
              Required
            </label>
            <p
              id="opt-in-required-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Check to make this opt-in checkbox mandatory for users.
            </p>
          </div>
        );
      case 'radio':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <div className="relative">
              <input
                type="text"
                value={comp.label || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'label', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter group label (e.g., Select an option)"
                maxLength={30}
                aria-label="Enter radio group label"
                aria-describedby="radio-label-help"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {(comp.label || '').length}/30
              </span>
              <p
                id="radio-label-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter a label for the radio group (e.g., "Select an option", max 30 characters). Required.
              </p>
            </div>
            <div className="mt-2">
              {comp.options.map((opt, optIndex) => (
                <div key={optIndex} className="mb-2 p-2 border border-gray-200 rounded flex items-center justify-between">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={opt.label || ''}
                      onChange={(e) => updateOption(screenIndex, compIndex, optIndex, 'label', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg mb-1 shadow-sm focus:outline-none text-sm pr-16"
                      placeholder={`Option ${optIndex + 1}`}
                      maxLength={30}
                      aria-label={`Enter option ${optIndex + 1} label`}
                      aria-describedby={`radio-option-${optIndex}-help`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                      {(opt.label || '').length}/30
                    </span>
                    <p
                      id={`radio-option-${optIndex}-help`}
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Enter the label for option {optIndex + 1} (max 30 characters). Required.
                    </p>
                  </div>
                  <button
                    onClick={() => removeOption(screenIndex, compIndex, optIndex)}
                    className="p-1 bg-transparent border-none cursor-pointer"
                    aria-label={`Remove option ${optIndex + 1}`}
                  >
                    <Delete className="text-red-600" style={{ fontSize: '20px' }} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(screenIndex, compIndex)}
                className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-600 cursor-pointer"
                aria-label="Add new radio option"
              >
                <Add style={{ fontSize: '16px', verticalAlign: 'middle' }} /> Add Option
              </button>
              <p
                id="radio-add-option-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Add options for the single-choice radio group. At least one option is required.
              </p>
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <div className="relative">
              <input
                type="text"
                value={comp.label || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'label', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter group label (e.g., Select an option)"
                maxLength={30}
                aria-label="Enter checkbox group label"
                aria-describedby="checkbox-label-help"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {(comp.label || '').length}/30
              </span>
              <p
                id="checkbox-label-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter a label for the checkbox group (e.g., "Select an option", max 30 characters). Required.
              </p>
            </div>
            <div className="mt-2">
              {comp.options.map((opt, optIndex) => (
                <div key={optIndex} className="mb-2 p-2 border border-gray-200 rounded flex items-center justify-between">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={opt.label || ''}
                      onChange={(e) => updateOption(screenIndex, compIndex, optIndex, 'label', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg mb-1 shadow-sm focus:outline-none text-sm pr-16"
                      placeholder={`Option ${optIndex + 1}`}
                      maxLength={30}
                      aria-label={`Enter option ${optIndex + 1} label`}
                      aria-describedby={`checkbox-option-${optIndex}-help`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                      {(opt.label || '').length}/30
                    </span>
                    <p
                      id={`checkbox-option-${optIndex}-help`}
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Enter the label for option {optIndex + 1} (max 30 characters). Required.
                    </p>
                  </div>
                  <button
                    onClick={() => removeOption(screenIndex, compIndex, optIndex)}
                    className="p-1 bg-transparent border-none cursor-pointer"
                    aria-label={`Remove option ${optIndex + 1}`}
                  >
                    <Delete className="text-red-600" style={{ fontSize: '20px' }} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(screenIndex, compIndex)}
                className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-600 cursor-pointer"
                aria-label="Add new checkbox option"
              >
                <Add style={{ fontSize: '16px', verticalAlign: 'middle' }} /> Add Option
              </button>
              <p
                id="checkbox-add-option-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Add options for the multiple-choice checkbox group. At least one option is required.
              </p>
            </div>
          </div>
        );
      case 'dropdown':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <div className="relative">
              <input
                type="text"
                value={comp.label || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'label', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter group label (e.g., Select an option)"
                maxLength={20}
                aria-label="Enter dropdown label"
                aria-describedby="dropdown-label-help"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {(comp.label || '').length}/20
              </span>
              <p
                id="dropdown-label-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter a label for the dropdown (e.g., "Select an option", max 20 characters). Required.
              </p>
            </div>
            <div className="mt-2">
              {comp.options.map((opt, optIndex) => (
                <div key={optIndex} className="mb-2 p-2 border border-gray-200 rounded flex items-center justify-between">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={opt.label || ''}
                      onChange={(e) => updateOption(screenIndex, compIndex, optIndex, 'label', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg mb-1 shadow-sm focus:outline-none text-sm pr-16"
                      placeholder={`Option ${optIndex + 1}`}
                      maxLength={80}
                      aria-label={`Enter option ${optIndex + 1} label`}
                      aria-describedby={`dropdown-option-${optIndex}-help`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                      {(opt.label || '').length}/80
                    </span>
                    <p
                      id={`dropdown-option-${optIndex}-help`}
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Enter the label for option {optIndex + 1} (max 80 characters). Required.
                    </p>
                  </div>
                  <button
                    onClick={() => removeOption(screenIndex, compIndex, optIndex)}
                    className="p-1 bg-transparent border-none cursor-pointer"
                    aria-label={`Remove option ${optIndex + 1}`}
                  >
                    <Delete className="text-red-600" style={{ fontSize: '20px' }} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(screenIndex, compIndex)}
                className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-600 cursor-pointer"
                aria-label="Add new dropdown option"
              >
                <Add style={{ fontSize: '16px', verticalAlign: 'middle' }} /> Add Option
              </button>
              <p
                id="dropdown-add-option-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Add options for the dropdown menu. At least one option is required.
              </p>
            </div>
          </div>
        );
      case 'date_picker':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <div className="relative">
              <input
                type="text"
                value={comp.label || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'label', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter label (e.g., Select Date)"
                maxLength={20}
                aria-label="Enter date picker label"
                aria-describedby="date-picker-label-help"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {(comp.label || '').length}/20
              </span>
              <p
                id="date-picker-label-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Enter a label for the date picker (e.g., "Select Date", max 20 characters). Required.
              </p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Instruction</label>
            <div className="relative">
              <input
                type="text"
                value={comp.instruction || ''}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'instruction', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white pr-16"
                placeholder="Enter instruction text"
                maxLength={80}
                aria-label="Enter date picker instruction"
                aria-describedby="date-picker-instruction-help"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {(comp.instruction || '').length}/80
              </span>
              <p
                id="date-picker-instruction-help"
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginTop: '8px',
                  fontWeight: '400',
                }}
              >
                Provide guidance for the date picker (e.g., "Choose your appointment date", max 80 characters). Optional.
              </p>
            </div>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={comp.required || false}
                onChange={(e) => updateComponent(screenIndex, compIndex, 'required', e.target.checked)}
                className="mr-2"
                aria-label="Mark date picker as required"
                aria-describedby="date-picker-required-help"
              />
              Required
            </label>
            <p
              id="date-picker-required-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Check to make this date picker mandatory for users.
            </p>
          </div>
        );
      case 'yes_no':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yes Button Text</label>
            <input
              type="text"
              value={comp.yesText || 'Yes'}
              onChange={(e) => updateComponent(screenIndex, compIndex, 'yesText', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white"
              placeholder="Enter Yes text"
              aria-label="Enter yes button text"
              aria-describedby="yes-no-yes-text-help"
            />
            <p
              id="yes-no-yes-text-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Enter the text for the Yes button (e.g., "Yes"). Required.
            </p>
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">No Button Text</label>
            <input
              type="text"
              value={comp.noText || 'No'}
              onChange={(e) => updateComponent(screenIndex, compIndex, 'noText', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-sm bg-white"
              placeholder="Enter No text"
              aria-label="Enter no button text"
              aria-describedby="yes-no-no-text-help"
            />
            <p
              id="yes-no-no-text-help"
              style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                marginTop: '8px',
                fontWeight: '400',
              }}
            >
              Enter the text for the No button (e.g., "No"). Required.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="mb-4">
      <div
        className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div {...listeners} className="cursor-grab p-1">
            <DragIndicator className="text-gray-500" style={{ fontSize: '16px' }} />
          </div>
          <label className="text-sm font-medium text-gray-700">
            Component {compIndex + 1}: {comp.type.replace('_', ' ').toUpperCase()}
          </label>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeComponent(screenIndex, compIndex);
          }}
          className="p-1 bg-transparent border-none cursor-pointer"
          title="Remove Component"
          aria-label="Remove component"
        >
          <Delete className="text-red-600" style={{ fontSize: '20px' }} />
        </button>
      </div>
      {isOpen && (
        <div className="p-4 border border-t-0 border-gray-200 rounded-b-lg bg-gray-50">
          {renderComponentEditor()}
        </div>
      )}
    </div>
  );
};

export default SortableComponent;