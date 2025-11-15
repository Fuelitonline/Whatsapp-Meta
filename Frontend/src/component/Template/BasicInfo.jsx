import React, { useState, useEffect } from 'react';
import useTemplateStore from '../../app/templateStore';

const BasicInfo = () => {
  const {
    templateName,
    setTemplateName,
    language,
    setLanguage,
    category,
    handleCategoryChange,
    templateType,
    setTemplateType,
    marketingType,
    setMarketingType,
    touched,
    setTouched,
    parameterFormat,
    setParameterFormat,
    getSupportedLanguages,
  } = useTemplateStore();

  const [nameError, setNameError] = useState('');
  const [languageError, setLanguageError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [parameterFormatError, setParameterFormatError] = useState('');

  const supportedLanguages = getSupportedLanguages();

  const validateTemplateName = (name) => {
    if (!name) {
      return 'Template name is required.';
    }
    if (!/^[a-z0-9_]+$/.test(name)) {
      return 'Template name must contain only lowercase letters, numbers, and underscores.';
    }
    if (name.length > 512) {
      return 'Template name must not exceed 512 characters.';
    }
    return '';
  };

  const validateLanguage = (lang) => {
    if (!lang) {
      return 'Language is required.';
    }
    if (!supportedLanguages.some((l) => l.code === lang)) {
      return 'Selected language is not supported.';
    }
    return '';
  };

  const validateCategory = (cat) => {
    return cat ? '' : 'Category is required.';
  };

  const validateParameterFormat = (format) => {
    if (!['NAMED', 'POSITIONAL'].includes(format)) {
      return 'Parameter format must be either Named or Positional.';
    }
    return '';
  };

  const handleTemplateNameChange = (e) => {
    const value = e.target.value;
    setTemplateName(value);
    setTouched('templateName');
    setNameError(validateTemplateName(value));
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setLanguage(value);
    setTouched('language');
    setLanguageError(validateLanguage(value));
  };

  const handleCategorySelection = (value) => {
    handleCategoryChange(value);
    setTouched('category');
    setCategoryError(validateCategory(value));
    if (value !== 'MARKETING') {
      setMarketingType('');
      setTemplateType(value === 'AUTHENTICATION' ? 'AUTHENTICATION' : 'CUSTOM');
    } else {
      setTemplateType('CUSTOM');
      setMarketingType('CUSTOM');
    }
  };

  const handleTemplateTypeChange = (e) => {
    const value = e.target.value;
    if (category === 'MARKETING') {
      setMarketingType(value);
      setTemplateType(value === 'FLOW' ? 'FLOW' : 'CUSTOM');
    } else {
      setTemplateType(value);
      setMarketingType('');
    }
  };

  const handleParameterFormatChange = (e) => {
    const value = e.target.value.toUpperCase();
    setParameterFormat(value);
    setTouched('parameterFormat');
    setParameterFormatError(validateParameterFormat(value));
  };

  useEffect(() => {
    if (touched.templateName) {
      setNameError(validateTemplateName(templateName));
    }
    if (touched.language) {
      setLanguageError(validateLanguage(language));
    }
    if (touched.category) {
      setCategoryError(validateCategory(category));
    }
    if (touched.parameterFormat) {
      setParameterFormatError(validateParameterFormat(parameterFormat));
    }
  }, [templateName, language, category, parameterFormat, touched]);

  const renderTemplateTypeOptions = () => {
    return (
      <div style={{ marginTop: '16px' }}>
        <label
          htmlFor="template-type"
          style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px',
            display: 'block',
          }}
        >
          Template Type
        </label>
        <select
          id="template-type"
          value={category === 'MARKETING' ? marketingType : templateType}
          onChange={handleTemplateTypeChange}
          aria-label="Select template type"
          aria-describedby="template-type-help"
          aria-invalid={!!(touched.category && categoryError)}
          style={{
            width: '100%',
            border: touched.category && categoryError ? '1px solid #DC2626' : '1px solid #D1D5DB',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            fontSize: '0.875rem',
            backgroundColor: '#FFFFFF',
          }}
        >
          {category === 'MARKETING' && (
            <>
              <option value="CUSTOM">Custom</option>
              <option value="CATALOG">Catalog</option>
              <option value="COUPON">Coupon</option>
              <option value="LIMITED_TIME_OFFER">Limited-Time Offer</option>
              <option value="MEDIA_CAROUSEL">Media Carousel</option>
              <option value="PRODUCT_CAROUSEL">Product Carousel</option>
              <option value="MPM">Multi-Product Message</option>
              <option value="SPM">Single-Product Message</option>
              <option value="FLOW">Flow</option>
            </>
          )}
          {category === 'UTILITY' && (
            <>
              <option value="CUSTOM">Custom</option>
              <option value="FLOW">Flow</option>
            </>
          )}
          {category === 'AUTHENTICATION' && (
            <option value="AUTHENTICATION">Authentication</option>
          )}
        </select>
        <p
          id="template-type-help"
          style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            marginTop: '8px',
            fontWeight: '400',
          }}
        >
          Select the type of template based on its purpose.
        </p>
        <div style={{ marginTop: '16px' }}>
          <label
            htmlFor="parameter-format"
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Parameter Format
          </label>
          <select
            id="parameter-format"
            value={parameterFormat.toLowerCase()}
            onChange={handleParameterFormatChange}
            aria-label="Select parameter format"
            aria-describedby={touched.parameterFormat && parameterFormatError ? 'parameter-format-error' : 'parameter-format-help'}
            aria-invalid={!!(touched.parameterFormat && parameterFormatError)}
            style={{
              width: '100%',
              border: touched.parameterFormat && parameterFormatError ? '1px solid #DC2626' : '1px solid #D1D5DB',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
            }}
          >
            <option value="positional">Positional</option>
            <option value="named">Named</option>
          </select>
          <p
            id="parameter-format-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              fontWeight: '400',
            }}
          >
            Choose how variables are formatted. Positional uses {'{{1}}'}, {'{{2}}'}, etc. Named uses {'{{first_name}}'}, {'{{order_id}}'}, etc.
          </p>
          {touched.parameterFormat && parameterFormatError && (
            <p
              id="parameter-format-error"
              style={{
                fontSize: '0.75rem',
                color: '#DC2626',
                marginTop: '4px',
                fontWeight: '400',
              }}
            >
              {parameterFormatError}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '24px',
        }}
      >
        Basic Information
      </h3>
      <div style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label
            htmlFor="template-name"
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Template Name
          </label>
          <input
            id="template-name"
            type="text"
            value={templateName}
            onChange={handleTemplateNameChange}
            aria-label="Enter template name"
            aria-describedby={touched.templateName && nameError ? 'template-name-error' : 'template-name-help'}
            aria-invalid={!!(touched.templateName && nameError)}
            style={{
              width: '100%',
              border: touched.templateName && nameError ? '1px solid #DC2626' : '1px solid #D1D5DB',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
            }}
            placeholder="Enter template name"
          />
          <p
            id="template-name-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              fontWeight: '400',
            }}
          >
            Must be lowercase letters, numbers, or underscores only. Max 512 characters.
          </p>
          {touched.templateName && nameError && (
            <p
              id="template-name-error"
              style={{
                fontSize: '0.75rem',
                color: '#DC2626',
                marginTop: '4px',
                fontWeight: '400',
              }}
            >
              {nameError}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="language"
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            aria-label="Select language"
            aria-describedby={touched.language && languageError ? 'language-error' : 'language-help'}
            aria-invalid={!!(touched.language && languageError)}
            style={{
              width: '100%',
              border: touched.language && languageError ? '1px solid #DC2626' : '1px solid #D1D5DB',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
            }}
          >
            <option value="">Select language</option>
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
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
            Choose the language for your template. Ensure translations are consistent.
          </p>
          {touched.language && languageError && (
            <p
              id="language-error"
              style={{
                fontSize: '0.75rem',
                color: '#DC2626',
                marginTop: '4px',
                fontWeight: '400',
              }}
            >
              {languageError}
            </p>
          )}
        </div>
        <div>
          <label
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Category
          </label>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                padding: '16px',
                border: category === 'UTILITY' ? '2px solid #2563EB' : (touched.category && categoryError ? '2px solid #DC2626' : '1px solid #D1D5DB'),
                borderRadius: '8px',
                backgroundColor: category === 'UTILITY' ? '#EFF6FF' : '#FFFFFF',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '100px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
              onClick={() => handleCategorySelection('UTILITY')}
            >
              <input
                type="radio"
                id="utility"
                name="category"
                value="UTILITY"
                checked={category === 'UTILITY'}
                onChange={() => handleCategorySelection('UTILITY')}
                style={{ marginBottom: '8px', accentColor: '#2563EB' }}
                aria-label="Select Utility category"
              />
              <label id="utility-label" htmlFor="utility">
                Utility
              </label>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  margin: '4px 0',
                  fontWeight: '400',
                }}
              >
                Updates, account, order, or payment notifications
              </p>
            </div>
            <div
              style={{
                padding: '16px',
                border: category === 'MARKETING' ? '2px solid #2563EB' : (touched.category && categoryError ? '2px solid #DC2626' : '1px solid #D1D5DB'),
                borderRadius: '8px',
                backgroundColor: category === 'MARKETING' ? '#EFF6FF' : '#FFFFFF',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '100px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
              onClick={() => handleCategorySelection('MARKETING')}
            >
              <input
                type="radio"
                id="marketing"
                name="category"
                value="MARKETING"
                checked={category === 'MARKETING'}
                onChange={() => handleCategorySelection('MARKETING')}
                style={{ marginBottom: '8px', accentColor: '#2563EB' }}
                aria-label="Select Marketing category"
              />
              <label id="marketing-label" htmlFor="marketing">
                Marketing
              </label>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  margin: '4px 0',
                  fontWeight: '400',
                }}
              >
                Promotions, offers, or product announcements
              </p>
            </div>
            <div
              style={{
                padding: '16px',
                border: category === 'AUTHENTICATION' ? '2px solid #2563EB' : (touched.category && categoryError ? '2px solid #DC2626' : '1px solid #D1D5DB'),
                borderRadius: '8px',
                backgroundColor: category === 'AUTHENTICATION' ? '#EFF6FF' : '#FFFFFF',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '100px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
              onClick={() => handleCategorySelection('AUTHENTICATION')}
            >
              <input
                type="radio"
                id="authentication"
                name="category"
                value="AUTHENTICATION"
                checked={category === 'AUTHENTICATION'}
                onChange={() => handleCategorySelection('AUTHENTICATION')}
                style={{ marginBottom: '8px', accentColor: '#2563EB' }}
                aria-label="Select Authentication category"
              />
              <label id="authentication-label" htmlFor="authentication">
                Authentication
              </label>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  margin: '4px 0',
                  fontWeight: '400',
                }}
              >
                OTPs or login verifications
              </p>
            </div>
          </div>
          <p
            id="category-help"
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '8px',
              fontWeight: '400',
            }}
          >
            Select the category that best describes the purpose of your template. Utility templates are for transactional messages like order updates.
          </p>
          {touched.category && categoryError && (
            <p
              id="category-error"
              style={{
                fontSize: '0.75rem',
                color: '#DC2626',
                marginTop: '4px',
                fontWeight: '400',
              }}
            >
              {categoryError}
            </p>
          )}
        </div>
      </div>
      {category && renderTemplateTypeOptions()}
    </div>
  );
};

export default BasicInfo;