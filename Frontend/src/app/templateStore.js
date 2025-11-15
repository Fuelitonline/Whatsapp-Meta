import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const supportedLanguages = [
  { code: 'en_US', name: 'English (US)' },
  { code: 'en_GB', name: 'English (UK)' },
  { code: 'es_ES', name: 'Spanish (Spain)' },
  { code: 'es_MX', name: 'Spanish (Mexico)' },
  { code: 'es_AR', name: 'Spanish (Argentina)' },
  { code: 'pt_BR', name: 'Portuguese (Brazil)' },
  { code: 'pt_PT', name: 'Portuguese (Portugal)' },
  { code: 'fr_FR', name: 'French (France)' },
  { code: 'de_DE', name: 'German (Germany)' },
  { code: 'it_IT', name: 'Italian (Italy)' },
  { code: 'hi_IN', name: 'Hindi (India)' },
  { code: 'zh_CN', name: 'Chinese (Simplified)' },
  { code: 'zh_TW', name: 'Chinese (Traditional)' },
  { code: 'ja_JP', name: 'Japanese (Japan)' },
  { code: 'ko_KR', name: 'Korean (South Korea)' },
  { code: 'ar_AR', name: 'Arabic' },
  { code: 'ru_RU', name: 'Russian (Russia)' },
  { code: 'id_ID', name: 'Indonesian (Indonesia)' },
  { code: 'ms_MY', name: 'Malay (Malaysia)' },
  { code: 'th_TH', name: 'Thai (Thailand)' },
  { code: 'vi_VN', name: 'Vietnamese (Vietnam)' },
  { code: 'bn_IN', name: 'Bengali (India)' },
  { code: 'ta_IN', name: 'Tamil (India)' },
  { code: 'te_IN', name: 'Telugu (India)' },
  { code: 'mr_IN', name: 'Marathi (India)' },
  { code: 'gu_IN', name: 'Gujarati (India)' },
  { code: 'kn_IN', name: 'Kannada (India)' },
  { code: 'ml_IN', name: 'Malayalam (India)' },
  { code: 'pa_IN', name: 'Punjabi (India)' },
];

const useTemplateStore = create(
  persist(
    (set, get) => ({
      // State
      sidebarOpen: false,
      userDropdownOpen: false,
      activeNavItem: 'create template',
      templateName: '',
      language: '',
      languagePolicy: 'deterministic',
      category: 'UTILITY',
      templateType: 'CUSTOM',
      marketingType: '',
      headerEnabled: false,
      headerType: 'TEXT',
      headerText: '',
      headerMediaType: 'id',
      headerMediaId: '',
      headerMediaLink: '',
      headerFile: null,
      headerPreviewUrl: null,
      headerLocationLatitude: '',
      headerLocationLongitude: '',
      headerLocationName: '',
      headerLocationAddress: '',
      bodyText: '',
      bodyParameters: [],
      footerEnabled: false,
      footerText: '',
      buttonsEnabled: false,
      buttons: [],
      flowEnabled: false,
      flowId: '',
      flowButtonText: '',
      flowMessageVersion: '',
      flowAction: 'navigate',
      flowToken: 'unused',
      otpButtonType: 'COPY_CODE',
      otpExpiry: '10',
      addSecurityRecommendation: false,
      includePackageName: false,
      packageName: '',
      catalogId: '',
      catalogThumbnailId: '',
      couponCode: '',
      hasExpiration: false,
      limitedTimeOfferText: '',
      carouselCardCount: 2,
      mpmSections: [],
      spmProductId: '',
      sampleValues: [],
      error: '',
      touched: {},
      parameterFormat: 'POSITIONAL',

      // Actions
      setSidebarOpen: (value) => set({ sidebarOpen: value }),
      setUserDropdownOpen: (value) => set({ userDropdownOpen: value }),
      setActiveNavItem: (item) => set({ activeNavItem: item }),
      setTemplateName: (name) => set({ templateName: name }),
      setLanguage: (lang) => {
        if (supportedLanguages.some((l) => l.code === lang) || lang === '') {
          set({ language: lang });
        }
      },
      setCategory: (category) => set({ category }),
      setTemplateType: (type) => set({ templateType: type }),
      setMarketingType: (type) => set({ marketingType: type }),
      setHeaderEnabled: (value) => set({ headerEnabled: value }),
      setHeaderType: (type) => set({ headerType: type }),
      setHeaderText: (text) => set({ headerText: text }),
      setHeaderMediaType: (type) => set({ headerMediaType: type }),
      setHeaderMediaId: (id) => set({ headerMediaId: id }),
      setHeaderMediaLink: (link) => set({ headerMediaLink: link }),
      setHeaderFile: (file) => set({ headerFile: file }),
      setHeaderPreviewUrl: (url) => set({ headerPreviewUrl: url }),
      setHeaderLocationLatitude: (latitude) => set({ headerLocationLatitude: latitude }),
      setHeaderLocationLongitude: (longitude) => set({ headerLocationLongitude: longitude }),
      setHeaderLocationName: (name) => set({ headerLocationName: name }),
      setHeaderLocationAddress: (address) => set({ headerLocationAddress: address }),
      setBodyText: (text) => set({ bodyText: text }),
      setBodyParameters: (params) => set({ bodyParameters: params }),
      setFooterEnabled: (value) => set({ footerEnabled: value }),
      setFooterText: (text) => set({ footerText: text }),
      setButtonsEnabled: (value) => set({ buttonsEnabled: value }),
      setButtons: (buttons) => set({ buttons }),
      setFlowEnabled: (value) => set({ flowEnabled: value }),
      setFlowId: (id) => set({ flowId: id }),
      setFlowButtonText: (text) => set({ flowButtonText: text }),
      setFlowMessageVersion: (version) => set({ flowMessageVersion: version }),
      setFlowAction: (action) => set({ flowAction: action }),
      setFlowToken: (token) => set({ flowToken: token }),
      setOtpButtonType: (type) => set({ otpButtonType: type }),
      setOtpExpiry: (expiry) => set({ otpExpiry: expiry }),
      setAddSecurityRecommendation: (value) => set({ addSecurityRecommendation: value }),
      setIncludePackageName: (value) => set({ includePackageName: value }),
      setPackageName: (name) => set({ packageName: name }),
      setCatalogId: (id) => set({ catalogId: id }),
      setCatalogThumbnailId: (id) => set({ catalogThumbnailId: id }),
      setCouponCode: (code) => set({ couponCode: code }),
      setHasExpiration: (value) => set({ hasExpiration: value }),
      setLimitedTimeOfferText: (text) => set({ limitedTimeOfferText: text }),
      setCarouselCardCount: (count) => set({ carouselCardCount: count }),
      setMpmSections: (sections) => set({ mpmSections: sections }),
      setSpmProductId: (id) => set({ spmProductId: id }),
      setSampleValues: (arg) => set((state) => {
        let newSampleValues = typeof arg === 'function' ? arg(state.sampleValues) : arg;
        if (state.parameterFormat === 'POSITIONAL' && Array.isArray(newSampleValues)) {
          newSampleValues = newSampleValues.map((value, index) => ({
            type: state.bodyParameters[index]?.type || 'text',
            value: typeof value === 'string' ? value : value?.value || '',
          }));
        }
        return { sampleValues: newSampleValues };
      }),
      setError: (error) => set({ error }),
      setTouched: (field, value = true) => set((state) => ({
        touched: { ...state.touched, [field]: value },
      })),
      setParameterFormat: (format) => set((state) => {
        const newBodyText = format === 'POSITIONAL'
          ? state.bodyText.replace(/{{[a-z0-9_]+}}/g, '')
          : state.bodyText.replace(/{{[0-9]+}}/g, '');
        const newBodyParameters = [];
        const newSampleValues = format === 'POSITIONAL' ? [] : {};
        return {
          parameterFormat: format,
          bodyText: newBodyText,
          bodyParameters: newBodyParameters,
          sampleValues: newSampleValues,
        };
      }),
      getSupportedLanguages: () => supportedLanguages,
      initializeTemplate: (template) => set(() => {
        const isAuthTemplate = template?.category === 'AUTHENTICATION';
        const isMarketingTemplate = template?.category === 'MARKETING';
        const bodyComponent = template?.components?.find((c) => c.type === 'body');
        const parameterFormat = template?.parameter_format || 'POSITIONAL';
        const placeholders = bodyComponent?.text?.match(/{{[a-z0-9_]+}}|{{[0-9]+}}/g) || [];

        const bodyParameters = placeholders.map((placeholder, index) => ({
          type: Array.isArray(bodyComponent?.parameters) && bodyComponent.parameters[index]?.type || 'text',
          text: Array.isArray(bodyComponent?.parameters) && bodyComponent.parameters[index]?.text || '',
          placeholder,
        }));

        const sampleValues = parameterFormat === 'POSITIONAL'
          ? Array.isArray(bodyComponent?.example?.body_text?.[0])
            ? bodyComponent.example.body_text[0].map((value, index) => ({
                type: bodyParameters[index]?.type || 'text',
                value,
              }))
            : []
          : Array.isArray(bodyComponent?.example?.body_text_named_params)
            ? bodyComponent.example.body_text_named_params.reduce(
                (acc, param) => ({
                  ...acc,
                  [param.param_name]: { type: 'text', value: param.example },
                }),
                {}
              )
            : {};

        const flowComponent = template?.components?.find((c) => c.type === 'buttons' && c.buttons?.[0]?.type === 'FLOW');

        return {
          templateName: template?.name || '',
          language: supportedLanguages.some((l) => l.code === template?.language?.code) ? template?.language?.code : '',
          languagePolicy: template?.language?.policy || 'deterministic',
          category: template?.category || 'UTILITY',
          templateType:
            isAuthTemplate
              ? 'AUTHENTICATION'
              : flowComponent
              ? 'FLOW'
              : template?.components?.some((c) => c.type === 'CATALOG')
              ? 'CATALOG'
              : template?.components?.some((c) => c.type === 'MPM')
              ? 'MPM'
              : template?.components?.some((c) => c.type === 'SPM')
              ? 'SPM'
              : 'CUSTOM',
          marketingType:
            isMarketingTemplate
              ? template?.components?.some((c) => c.type === 'COUPON')
                ? 'COUPON'
                : template?.components?.some((c) => c.type === 'LIMITED_TIME_OFFER')
                ? 'LIMITED_TIME_OFFER'
                : template?.components?.some((c) => c.type === 'MEDIA_CAROUSEL')
                ? 'MEDIA_CAROUSEL'
                : template?.components?.some((c) => c.type === 'PRODUCT_CAROUSEL')
                ? 'PRODUCT_CAROUSEL'
                : template?.components?.some((c) => c.type === 'MPM')
                ? 'MPM'
                : template?.components?.some((c) => c.type === 'SPM')
                ? 'SPM'
                : flowComponent
                ? 'FLOW'
                : 'CUSTOM'
              : '',
          headerEnabled: !!template?.components?.find((c) => c.type === 'header'),
          headerType: template?.components?.find((c) => c.type === 'header')?.format || 'TEXT',
          headerText: template?.components?.find((c) => c.type === 'header' && c.format === 'TEXT')?.text || '',
          headerMediaId: template?.components?.find((c) => c.type === 'header' && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(c.format))?.example?.header_handle?.[0] || '',
          headerMediaLink: template?.components?.find((c) => c.type === 'header' && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(c.format))?.link || '',
          headerLocationLatitude: template?.components?.find((c) => c.type === 'header' && c.format === 'LOCATION')?.location?.latitude || '',
          headerLocationLongitude: template?.components?.find((c) => c.type === 'header' && c.format === 'LOCATION')?.location?.longitude || '',
          headerLocationName: template?.components?.find((c) => c.type === 'header' && c.format === 'LOCATION')?.location?.name || '',
          headerLocationAddress: template?.components?.find((c) => c.type === 'header' && c.format === 'LOCATION')?.location?.address || '',
          bodyText: bodyComponent?.text || '',
          bodyParameters,
          footerEnabled: !!template?.components?.find((c) => c.type === 'footer'),
          footerText: template?.components?.find((c) => c.type === 'footer')?.text || '',
          buttonsEnabled: !!template?.components?.find((c) => c.type === 'buttons'),
          buttons: template?.components?.find((c) => c.type === 'buttons')?.buttons?.map((b, index) => ({
            id: index,
            sub_type: b.type,
            text: b.text,
            parameters: [{
              [b.type === 'url' ? 'text' : b.type === 'phone_number' ? 'phone_number' : b.type === 'catalog' ? 'catalog_id' : 'payload']: b[b.type === 'url' ? 'url' : b.type === 'phone_number' ? 'phone_number' : b.type === 'catalog' ? 'catalog_id' : 'payload'],
            }],
          })) || [],
          flowEnabled: !!flowComponent,
          flowId: flowComponent?.buttons?.[0]?.parameters?.[0]?.flow_id || '',
          flowButtonText: flowComponent?.buttons?.[0]?.text || '',
          flowMessageVersion: flowComponent?.buttons?.[0]?.parameters?.[0]?.flow_message_version || '',
          flowAction: flowComponent?.buttons?.[0]?.parameters?.[0]?.flow_action || 'navigate',
          flowToken: flowComponent?.buttons?.[0]?.parameters?.[0]?.flow_token || 'unused',
          otpButtonType: template?.components?.find((c) => c.type === 'buttons')?.buttons?.[0]?.type?.toUpperCase() || 'COPY_CODE',
          otpExpiry: template?.otp_expiry || '10',
          addSecurityRecommendation: template?.add_security_recommendation || false,
          includePackageName: template?.include_package_name || false,
          packageName: template?.package_name || '',
          catalogId: template?.components?.find((c) => ['catalog', 'product_list', 'product'].includes(c.type))?.catalog_id || '',
          catalogThumbnailId: template?.components?.find((c) => c.type === 'catalog')?.thumbnail_product_retailer_id || '',
          couponCode: template?.components?.find((c) => c.type === 'coupon_code')?.code || '',
          hasExpiration: !!template?.components?.find((c) => c.type === 'limited_time_offer'),
          limitedTimeOfferText: template?.components?.find((c) => c.type === 'limited_time_offer')?.text || '',
          carouselCardCount: template?.components?.find((c) => c.type === 'carousel')?.card_count || 2,
          mpmSections: template?.components?.find((c) => c.type === 'product_list')?.sections || [],
          spmProductId: template?.components?.find((c) => c.type === 'product')?.product_retailer_id || '',
          sampleValues,
          error: '',
          touched: {},
          parameterFormat,
        };
      }),
      handleCategoryChange: (category) => set(() => ({
        category,
        templateType: category === 'AUTHENTICATION' ? 'AUTHENTICATION' : 'CUSTOM',
        marketingType: category === 'MARKETING' ? 'CUSTOM' : '',
        headerEnabled: false,
        headerType: 'TEXT',
        headerText: '',
        headerMediaType: 'id',
        headerMediaId: '',
        headerMediaLink: '',
        headerFile: null,
        headerPreviewUrl: null,
        headerLocationLatitude: '',
        headerLocationLongitude: '',
        headerLocationName: '',
        headerLocationAddress: '',
        bodyText: '',
        bodyParameters: [],
        footerEnabled: false,
        footerText: '',
        buttonsEnabled: false,
        buttons: [],
        flowEnabled: false,
        flowId: '',
        flowButtonText: '',
        flowMessageVersion: '',
        flowAction: 'navigate',
        flowToken: 'unused',
        otpButtonType: 'COPY_CODE',
        otpExpiry: '10',
        addSecurityRecommendation: false,
        includePackageName: false,
        packageName: '',
        catalogId: '',
        catalogThumbnailId: '',
        couponCode: '',
        hasExpiration: false,
        limitedTimeOfferText: '',
        carouselCardCount: 2,
        mpmSections: [],
        spmProductId: '',
        sampleValues: [],
        error: '',
        touched: {},
        parameterFormat: 'POSITIONAL',
      })),
      reset: () => set(() => ({
        templateName: '',
        language: '',
        languagePolicy: 'deterministic',
        category: 'UTILITY',
        templateType: 'CUSTOM',
        marketingType: '',
        headerEnabled: false,
        headerType: 'TEXT',
        headerText: '',
        headerMediaType: 'id',
        headerMediaId: '',
        headerMediaLink: '',
        headerFile: null,
        headerPreviewUrl: null,
        headerLocationLatitude: '',
        headerLocationLongitude: '',
        headerLocationName: '',
        headerLocationAddress: '',
        bodyText: '',
        bodyParameters: [],
        footerEnabled: false,
        footerText: '',
        buttonsEnabled: false,
        buttons: [],
        flowEnabled: false,
        flowId: '',
        flowButtonText: '',
        flowMessageVersion: '',
        flowAction: 'navigate',
        flowToken: 'unused',
        otpButtonType: 'COPY_CODE',
        otpExpiry: '10',
        addSecurityRecommendation: false,
        includePackageName: false,
        packageName: '',
        catalogId: '',
        catalogThumbnailId: '',
        couponCode: '',
        hasExpiration: false,
        limitedTimeOfferText: '',
        carouselCardCount: 2,
        mpmSections: [],
        spmProductId: '',
        sampleValues: [],
        error: '',
        touched: {},
        parameterFormat: 'POSITIONAL',
      })),
      validateForm: () => {
        const state = get();
        const errors = {
          templateName: '',
          language: '',
          category: '',
          headerText: '',
          headerMediaId: '',
          headerMediaLink: '',
          headerLocationName: '',
          headerLocationAddress: '',
          headerLocationLatitude: '',
          headerLocationLongitude: '',
          bodyText: '',
          footerText: '',
          buttons: [],
          flowId: '',
          flowButtonText: '',
          flowAction: '',
          flowToken: '',
          flowMessageVersion: '',
          otpButtonType: '',
          otpExpiry: '',
          couponCode: '',
          limitedTimeOfferText: '',
          carouselCardCount: '',
          catalogId: '',
          catalogThumbnailId: '',
          spmProductId: '',
          mpmSections: [],
          sampleValues: {},
          parameterFormat: '',
        };

        if (!state.templateName) {
          errors.templateName = 'Template name is required.';
        } else if (!/^[a-z0-9_]+$/.test(state.templateName)) {
          errors.templateName = 'Template name must contain only lowercase letters, numbers, and underscores.';
        } else if (state.templateName.length > 512) {
          errors.templateName = 'Template name must not exceed 512 characters.';
        }

        if (!state.language) {
          errors.language = 'Language is required.';
        } else if (!supportedLanguages.some((l) => l.code === state.language)) {
          errors.language = 'Selected language is not supported.';
        }

        if (!state.category) {
          errors.category = 'Category is required.';
        }

        if (!['NAMED', 'POSITIONAL'].includes(state.parameterFormat)) {
          errors.parameterFormat = 'Parameter format must be either NAMED or POSITIONAL.';
        }

        if (['CUSTOM', 'COUPON', 'LIMITED_TIME_OFFER', 'FLOW', 'AUTHENTICATION'].includes(state.templateType) && !state.bodyText) {
          errors.bodyText = 'Body text is required.';
        }
        if (state.bodyText) {
          const placeholders = state.bodyText.match(/{{[a-z0-9_]+}}|{{[0-9]+}}/g) || [];
          if (state.templateType === 'AUTHENTICATION') {
            if (placeholders.length !== 1 || placeholders[0] !== '{{1}}') {
              errors.bodyText = 'Authentication templates must contain exactly one {{1}} placeholder.';
            }
          } else if (placeholders.length > 0) {
            const invalidPlaceholders = placeholders.filter(p => !p.match(/{{[a-z0-9_]+}}/) && !p.match(/{{[0-9]+}}/));
            if (invalidPlaceholders.length > 0) {
              errors.bodyText = 'Placeholders must be in format {{1}}, {{2}}, or {{variable_name}}.';
            }
          }

          const expectedParams = placeholders.map((placeholder, index) => ({
            type: state.bodyParameters[index]?.type || 'text',
            text: state.bodyParameters[index]?.text || '',
            placeholder,
          }));
          if (JSON.stringify(state.bodyParameters) !== JSON.stringify(expectedParams)) {
            set({ bodyParameters: expectedParams });
          }
        }

        if (state.bodyText) {
          const placeholders = state.bodyText.match(/{{[a-z0-9_]+}}|{{[0-9]+}}/g) || [];
          if (state.parameterFormat === 'POSITIONAL') {
            placeholders.forEach((placeholder, index) => {
              if (!state.sampleValues[index] || !state.sampleValues[index].value) {
                errors.sampleValues[placeholder] = `Sample value is required for placeholder ${placeholder}.`;
              }
            });
          } else if (state.parameterFormat === 'NAMED') {
            placeholders.forEach((placeholder) => {
              const paramName = placeholder.replace(/{{|}}/g, '');
              if (!state.sampleValues[paramName] || !state.sampleValues[paramName].value) {
                errors.sampleValues[paramName] = `Sample value is required for placeholder ${placeholder}.`;
              }
            });
          }
        }

        if (['CUSTOM', 'COUPON', 'LIMITED_TIME_OFFER', 'FLOW', 'SPM', 'PRODUCT_CAROUSEL', 'CATALOG'].includes(state.templateType) && state.headerEnabled) {
          if (state.headerType === 'TEXT' && !state.headerText) {
            errors.headerText = 'Header text is required.';
          }
          if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(state.headerType)) {
            if (state.headerMediaType === 'id' && !state.headerMediaId) {
              errors.headerMediaId = 'Media ID is required.';
            }
            if (state.headerMediaType === 'link' && !state.headerMediaLink) {
              errors.headerMediaLink = 'Media link is required.';
            }
          }
          if (state.headerType === 'LOCATION') {
            if (!state.headerLocationName) {
              errors.headerLocationName = 'Location name is required.';
            }
            if (!state.headerLocationAddress) {
              errors.headerLocationAddress = 'Location address is required.';
            }
            if (!state.headerLocationLatitude || isNaN(state.headerLocationLatitude) || state.headerLocationLatitude < -90 || state.headerLocationLatitude > 90) {
              errors.headerLocationLatitude = 'Valid latitude (-90 to 90) is required.';
            }
            if (!state.headerLocationLongitude || isNaN(state.headerLocationLongitude) || state.headerLocationLongitude < -180 || state.headerLocationLongitude > 180) {
              errors.headerLocationLongitude = 'Valid longitude (-180 to 180) is required.';
            }
          }
          if (state.headerType === 'PRODUCT' && !state.catalogId) {
            errors.catalogId = 'Catalog ID is required for PRODUCT header.';
          }
        }

        if (state.footerEnabled) {
          if (!state.footerText) {
            errors.footerText = 'Footer text is required.';
          } else if (state.footerText.length > 60) {
            errors.footerText = 'Footer text must be 60 characters or less.';
          }
        }

        if (state.buttonsEnabled && state.templateType !== 'AUTHENTICATION') {
          errors.buttons = state.buttons.map(() => ({
            text: '',
            parameter: '',
          }));
          if (state.buttons.length === 0 || state.buttons.length > 10) {
            errors.buttons[0].text = 'Buttons must be between 1 and 10.';
          } else {
            const validButtonSubTypes = state.category === 'UTILITY'
              ? ['quick_reply', 'url', 'phone_number', 'copy_code']
              : ['quick_reply', 'url', 'phone_number', 'copy_code', 'catalog'];

            state.buttons.forEach((button, index) => {
              if (!button.text) {
                errors.buttons[index].text = 'Button text is required.';
              } else if (button.text.length > 25) {
                errors.buttons[index].text = 'Button text must be 25 characters or less.';
              }
              if (!validButtonSubTypes.includes(button.sub_type)) {
                errors.buttons[index].parameter = 'Invalid button type.';
              } else if (['url', 'phone_number', 'copy_code', 'catalog'].includes(button.sub_type)) {
                const param = button.parameters[0];
                if (!param) {
                  errors.buttons[index].parameter = `Parameter is required for ${button.sub_type} button.`;
                } else if (button.sub_type === 'phone_number' && (!param.phone_number || !/^\+?\d{1,20}$/.test(param.phone_number))) {
                  errors.buttons[index].parameter = 'Valid phone number is required.';
                } else if (button.sub_type === 'url' && (!param.text || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(param.text))) {
                  errors.buttons[index].parameter = 'Valid URL is required.';
                } else if (button.sub_type === 'catalog' && (!param.catalog_id || param.catalog_id !== state.catalogId)) {
                  errors.buttons[index].parameter = 'Catalog ID must match the template catalog ID.';
                } else if (button.sub_type === 'copy_code' && (!param.payload || param.payload.length > 15 || state.marketingType !== 'COUPON')) {
                  errors.buttons[index].parameter = 'Copy code payload must be 15 characters or less and only allowed for COUPON templates.';
                } else if (button.sub_type === 'quick_reply' && (!param.payload || param.payload.length > 100)) {
                  errors.buttons[index].parameter = 'Quick reply payload is required and must be 100 characters or less.';
                }
              }
            });
          }
        }

        if (state.flowEnabled) {
          if (!state.flowId) {
            errors.flowId = 'Flow ID is required.';
          }
          if (!state.flowButtonText) {
            errors.flowButtonText = 'Flow button text is required.';
          } else if (state.flowButtonText.length > 25) {
            errors.flowButtonText = 'Flow button text must be 25 characters or less.';
          }
          if (!state.flowAction) {
            errors.flowAction = 'Flow action is required.';
          }
          if (!state.flowToken) {
            errors.flowToken = 'Flow token is required.';
          }
          if (!state.flowMessageVersion || !/^\d+\.\d+(\.\d+)?$/.test(state.flowMessageVersion)) {
            errors.flowMessageVersion = 'Flow message version must be in the format X.Y or X.Y.Z (e.g., 1.0 or 1.0.0).';
          }
        }

        if (state.templateType === 'AUTHENTICATION') {
          if (!state.otpButtonType) {
            errors.otpButtonType = 'OTP button type is required.';
          }
          if (!state.otpExpiry || isNaN(state.otpExpiry) || Number(state.otpExpiry) <= 0 || Number(state.otpExpiry) > 1440) {
            errors.otpExpiry = 'OTP expiry must be a number between 1 and 1440 minutes.';
          }
        }

        if (state.marketingType === 'COUPON') {
          if (!state.couponCode) {
            errors.couponCode = 'Coupon code is required.';
          } else if (state.couponCode.length > 15) {
            errors.couponCode = 'Coupon code must be 15 characters or less.';
          }
        }

        if (state.marketingType === 'LIMITED_TIME_OFFER' && state.hasExpiration) {
          if (!state.limitedTimeOfferText) {
            errors.limitedTimeOfferText = 'Offer text is required.';
          } else if (state.limitedTimeOfferText.length > 72) {
            errors.limitedTimeOfferText = 'Offer text must be 72 characters or less.';
          }
        }

        if (['MEDIA_CAROUSEL', 'PRODUCT_CAROUSEL'].includes(state.marketingType)) {
          const cardCount = Number(state.carouselCardCount);
          if (isNaN(cardCount) || cardCount < 2 || cardCount > 10) {
            errors.carouselCardCount = 'Carousel card count must be a number between 2 and 10.';
          }
        }

        if (['CATALOG', 'PRODUCT_CAROUSEL', 'MPM', 'SPM'].includes(state.marketingType)) {
          if (!state.catalogId) {
            errors.catalogId = 'Catalog ID is required.';
          }
          if (state.marketingType === 'CATALOG' && !state.catalogThumbnailId) {
            errors.catalogThumbnailId = 'Catalog thumbnail ID is required.';
          }
        }

        if (state.marketingType === 'SPM') {
          if (!state.spmProductId) {
            errors.spmProductId = 'Product ID is required.';
          }
        }

        if (state.marketingType === 'MPM') {
          errors.mpmSections = state.mpmSections.map(() => ({
            title: '',
            products: [],
          }));
          if (!Array.isArray(state.mpmSections) || state.mpmSections.length === 0 || state.mpmSections.length > 10) {
            errors.mpmSections[0].title = 'Must have 1 to 10 sections.';
          } else {
            state.mpmSections.forEach((section, index) => {
              if (!section.title) {
                errors.mpmSections[index].title = 'Title is required.';
              } else if (section.title.length > 24) {
                errors.mpmSections[index].title = 'Title must be 24 characters or less.';
              }
              if (!Array.isArray(section.productItems) || section.productItems.length === 0) {
                errors.mpmSections[index].products[0] = 'Must have at least one product.';
              } else {
                section.productItems.forEach((product, pIndex) => {
                  if (!product.product_retailer_id) {
                    errors.mpmSections[index].products[pIndex] = 'Product ID is required.';
                  }
                });
              }
            });
          }
        }

        const hasError = Object.keys(errors).some(key => {
          const err = errors[key];
          if (typeof err === 'string' && err) return true;
          if (Array.isArray(err)) return err.some(section => Object.values(section).some(v => (typeof v === 'string' && v) || (Array.isArray(v) && v.some(p => p))));
          if (typeof err === 'object' && err !== null) return Object.values(err).some(v => v);
          return false;
        });

        const generalErrorLines = [];
        Object.keys(errors).forEach(key => {
          const err = errors[key];
          if (typeof err === 'string' && err) generalErrorLines.push(err);
          if (Array.isArray(err)) {
            err.forEach((section, index) => {
              if (section.text) generalErrorLines.push(`Button ${index + 1}: ${section.text}`);
              if (section.parameter) generalErrorLines.push(`Button ${index + 1}: ${section.parameter}`);
              if (section.title) generalErrorLines.push(`MPM section ${index + 1}: ${section.title}`);
              section.products.forEach((pErr, pIndex) => {
                if (pErr) generalErrorLines.push(`Product ${pIndex + 1} in MPM section ${index + 1}: ${pErr}`);
              });
            });
          }
          if (typeof err === 'object' && err !== null) {
            Object.keys(err).forEach(subKey => {
              if (err[subKey]) generalErrorLines.push(`${subKey}: ${err[subKey]}`);
            });
          }
        });
        const generalError = generalErrorLines.join('\n');

        return { hasError, generalError, errors };
      },
      clearStorage: () => {
        localStorage.removeItem('templateData');
        set({
          templateName: '',
          language: '',
          languagePolicy: 'deterministic',
          category: 'UTILITY',
          templateType: 'CUSTOM',
          marketingType: '',
          headerEnabled: false,
          headerType: 'TEXT',
          headerText: '',
          headerMediaType: 'id',
          headerMediaId: '',
          headerMediaLink: '',
          headerFile: null,
          headerPreviewUrl: null,
          headerLocationLatitude: '',
          headerLocationLongitude: '',
          headerLocationName: '',
          headerLocationAddress: '',
          bodyText: '',
          bodyParameters: [],
          footerEnabled: false,
          footerText: '',
          buttonsEnabled: false,
          buttons: [],
          flowEnabled: false,
          flowId: '',
          flowButtonText: '',
          flowMessageVersion: '',
          flowAction: 'navigate',
          flowToken: 'unused',
          otpButtonType: 'COPY_CODE',
          otpExpiry: '10',
          addSecurityRecommendation: false,
          includePackageName: false,
          packageName: '',
          catalogId: '',
          catalogThumbnailId: '',
          couponCode: '',
          hasExpiration: false,
          limitedTimeOfferText: '',
          carouselCardCount: 2,
          mpmSections: [],
          spmProductId: '',
          sampleValues: [],
          error: '',
          touched: {},
          parameterFormat: 'POSITIONAL',
        });
      },
    }),
    {
      name: 'templateData',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Remove file objects and preview URLs that can't be serialized
        const serializableState = { ...state };
        delete serializableState.headerFile;
        delete serializableState.headerPreviewUrl;
        return serializableState;
      },
    }
  )
);

export default useTemplateStore;