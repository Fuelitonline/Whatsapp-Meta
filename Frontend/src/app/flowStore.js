import { create } from 'zustand';

const useFlowStore = create((set) => ({
  flowName: '',
  description: '',
  language: 'en_US',
  status: 'DRAFT',
  screens: [],
  error: '',
  currentPreviewScreen: 0,
  selectedScreenIndex: 0,
  sidebarOpen: false,
  userDropdownOpen: false,
  activeNavItem: 'create flow',

  // Actions
  setFlowName: (name) => set({ flowName: name }),
  setDescription: (description) => set({ description }),
  setLanguage: (language) => set({ language }),
  setStatus: (status) => set({ status }),
  setScreens: (screens) => set({ screens }),
  setError: (error) => set({ error }),
  setCurrentPreviewScreen: (index) => set({ currentPreviewScreen: index }),
  setSelectedScreenIndex: (index) => set({ selectedScreenIndex: index }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleUserDropdown: () => set((state) => ({ userDropdownOpen: !state.userDropdownOpen })),
  setActiveNavItem: (item) => set({ activeNavItem: typeof item === 'string' ? item : 'create flow' }),

  addScreen: () =>
    set((state) => {
      const newScreenId = `SCREEN_${state.screens.length + 1}`;
      return {
        screens: [...state.screens, { id: newScreenId, title: '', instruction: '', components: [] }],
        selectedScreenIndex: state.screens.length,
      };
    }),

  removeScreen: (index) =>
    set((state) => {
      const newScreens = state.screens.filter((_, i) => i !== index);
      const newSelectedScreenIndex =
        state.selectedScreenIndex >= index && state.selectedScreenIndex > 0
          ? state.selectedScreenIndex - 1
          : state.selectedScreenIndex;
      const newCurrentPreviewScreen =
        state.currentPreviewScreen >= newScreens.length ? 0 : state.currentPreviewScreen;
      return {
        screens: newScreens,
        selectedScreenIndex: newSelectedScreenIndex,
        currentPreviewScreen: newCurrentPreviewScreen,
      };
    }),

  updateScreen: (index, field, value) =>
    set((state) => {
      const updatedScreens = [...state.screens];
      updatedScreens[index][field] = value;
      return { screens: updatedScreens };
    }),

  addComponent: (screenIndex, type) =>
    set((state) => {
      const updatedScreens = [...state.screens];
      const newComp = {
        id: `COMP_${Date.now()}`,
        type,
        ...(type === 'text_input'
          ? { inputType: 'text', label: '', placeholder: '', instruction: '', required: false, pattern: '', patternErrorText: '', minLength: '', maxLength: '' }
          : {}),
        ...(type === 'textarea' ? { label: '', instruction: '', required: false } : {}),
        ...(type === 'opt_in' ? { label: '', required: false } : {}),
        ...(type === 'radio' ? { label: '', options: [{ label: '' }] } : {}),
        ...(type === 'checkbox' ? { label: '', options: [{ label: '' }] } : {}),
        ...(type === 'dropdown' ? { label: '', options: [{ label: '' }] } : {}),
        ...(type === 'date_picker' ? { label: '', instruction: '', required: false } : {}),
        ...(type === 'yes_no' ? { yesText: 'Yes', noText: 'No' } : {}),
        ...(type === 'image' ? { url: '', altText: '' } : {}),
        ...(type === 'embedded_link' ? { text: '', url: '' } : {}),
        ...(type.includes('text_') ? { text: '' } : {}),
      };
      updatedScreens[screenIndex].components.push(newComp);
      return { screens: updatedScreens };
    }),

  removeComponent: (screenIndex, compIndex) =>
    set((state) => {
      const updatedScreens = [...state.screens];
      updatedScreens[screenIndex].components = updatedScreens[screenIndex].components.filter(
        (_, i) => i !== compIndex
      );
      return { screens: updatedScreens };
    }),

  updateComponent: (screenIndex, compIndex, field, value) =>
    set((state) => {
      const updatedScreens = [...state.screens];
      updatedScreens[screenIndex].components[compIndex][field] = value;
      return { screens: updatedScreens };
    }),

  addOption: (screenIndex, compIndex) =>
    set((state) => {
      const updatedScreens = [...state.screens];
      updatedScreens[screenIndex].components[compIndex].options.push({
        label: '',
      });
      return { screens: updatedScreens };
    }),

  updateOption: (screenIndex, compIndex, optIndex, field, value) =>
    set((state) => {
      const updatedScreens = [...state.screens];
      updatedScreens[screenIndex].components[compIndex].options[optIndex][field] = value;
      return { screens: updatedScreens };
    }),

  removeOption: (screenIndex, compIndex, optIndex) =>
    set((state) => {
      const updatedScreens = [...state.screens];
      updatedScreens[screenIndex].components[compIndex].options = updatedScreens[screenIndex].components[
        compIndex
      ].options.filter((_, i) => i !== optIndex);
      return { screens: updatedScreens };
    }),

  clear: () =>
    set({
      flowName: '',
      description: '',
      language: 'en_US',
      status: 'DRAFT',
      screens: [],
      error: '',
      currentPreviewScreen: 0,
      selectedScreenIndex: 0,
    }),

  validateAndSubmit: () =>
    set((state) => {
      if (!/^[a-z0-9_]+$/.test(state.flowName)) {
        return { error: 'Flow name must be lowercase, alphanumeric, and may include underscores only.' };
      }
      if (state.screens.length === 0) {
        return { error: 'At least one screen is required.' };
      }
      for (const screen of state.screens) {
        if (!screen.title) {
          return { error: `Screen ${screen.id} must have a title.` };
        }
        for (const comp of screen.components) {
          // Text component validations
          if (
            ['text_heading', 'text_subheading'].includes(comp.type) &&
            comp.text &&
            comp.text.length > 80
          ) {
            return { error: `Text for ${comp.type.replace('_', ' ')} in ${screen.title} exceeds 80 characters.` };
          }
          if (
            ['text_body', 'text_caption'].includes(comp.type) &&
            comp.text &&
            comp.text.length > 4096
          ) {
            return { error: `Text for ${comp.type.replace('_', ' ')} in ${screen.title} exceeds 4096 characters.` };
          }
          if (
            ['text_heading', 'text_subheading', 'text_body', 'text_caption'].includes(comp.type) &&
            !comp.text
          ) {
            return { error: `Text component in ${screen.title} must have text.` };
          }
          // Label validation for input components
          if (
            ['text_input', 'textarea', 'opt_in', 'checkbox', 'radio', 'dropdown', 'date_picker'].includes(
              comp.type
            ) &&
            !comp.label
          ) {
            return { error: `Component in ${screen.title} must have a label.` };
          }
          // text_input specific validations
          if (comp.type === 'text_input') {
            if (comp.label && comp.label.length > 20) {
              return { error: `Label for text input in ${screen.title} exceeds 20 characters.` };
            }
            if (comp.placeholder && comp.placeholder.length > 80) {
              return { error: `Placeholder for text input in ${screen.title} exceeds 80 characters.` };
            }
            if (comp.instruction && comp.instruction.length > 80) {
              return { error: `Instruction for text input in ${screen.title} exceeds 80 characters.` };
            }
            if (comp.patternErrorText && comp.patternErrorText.length > 100) {
              return { error: `Pattern error text for text input in ${screen.title} exceeds 100 characters.` };
            }
            if (comp.inputType === 'phone' && comp.pattern && !/^\^/.test(comp.pattern)) {
              return { error: `Custom pattern for phone in ${screen.title} must start with ^ for regex.` };
            }
            if (comp.inputType === 'number') {
              if (comp.minLength && isNaN(parseInt(comp.minLength))) {
                return { error: `Min length for number input in ${screen.title} must be a valid number.` };
              }
              if (comp.maxLength && isNaN(parseInt(comp.maxLength))) {
                return { error: `Max length for number input in ${screen.title} must be a valid number.` };
              }
            }
          }
          // Option-based component validations
          if (['radio', 'checkbox', 'dropdown'].includes(comp.type) && (!comp.options || comp.options.length === 0)) {
            return { error: `Component ${comp.label || comp.type} in ${screen.title} must have at least one option.` };
          }
          // Image and embedded link validations
          if (comp.type === 'image' && !comp.url && !comp.previewUrl) {
            return { error: `Image in ${screen.title} must have a URL.` };
          }
          if (comp.type === 'embedded_link' && (!comp.text || !comp.url)) {
            return { error: `Embedded Link in ${screen.title} must have text and URL.` };
          }
        }
      }
      const mapType = (type) => {
        switch (type) {
          case 'text_heading': return 'TextHeading';
          case 'text_subheading': return 'TextSubheading';
          case 'text_body': return 'TextBody';
          case 'text_caption': return 'TextCaption';
          case 'image': return 'Image';
          case 'embedded_link': return 'EmbeddedLink';
          case 'text_input': return 'Input';
          case 'textarea': return 'TextArea';
          case 'opt_in': return 'OptIn';
          case 'checkbox': return 'CheckboxGroup';
          case 'radio': return 'RadioButtonsGroup';
          case 'dropdown': return 'Dropdown';
          case 'date_picker': return 'DatePicker';
          case 'yes_no': return 'Footer';
          default: return type.toUpperCase();
        }
      };
      const payload = {
        name: state.flowName,
        language: state.language,
        description: state.description,
        version: '3.1',
        screens: state.screens.map((screen) => ({
          id: screen.id,
          title: screen.title,
          data: {},
          layout: {
            type: 'SingleColumnLayout',
            children: [
              ...(screen.instruction ? [{ type: 'TextBody', text: screen.instruction }] : []),
              ...screen.components.map((comp) => {
                let child = { type: mapType(comp.type) };
                if (comp.text) child.text = comp.text;
                if (comp.label) child.label = comp.label;
                if (comp.placeholder) child.placeholder = comp.placeholder;
                if (comp.defaultText) child.default_text = comp.defaultText;
                if (comp.required) child.required = comp.required;
                if (comp.minLength) child.min_length = parseInt(comp.minLength);
                if (comp.maxLength) child.max_length = parseInt(comp.maxLength);
                if (comp.pattern) child.pattern = comp.pattern;
                if (comp.patternErrorText) child.pattern_error_text = comp.patternErrorText;
                if (comp.inputType) child.input_type = comp.inputType;
                if (comp.url) child.url = comp.url;
                if (comp.altText) child.alt_text = comp.altText;
                if (comp.options)
                  child.options = comp.options.map((opt) => ({
                    label: opt.label,
                    description: opt.description,
                    postback_data: opt.postbackData || opt.label,
                  }));
                if (comp.minDate) child.min_date = comp.minDate;
                if (comp.maxDate) child.max_date = comp.maxDate;
                if (comp.defaultDate) child.default_date = comp.defaultDate;
                if (comp.yesText) child.yes_text = comp.yesText;
                if (comp.noText) child.no_text = comp.noText;
                if (comp.instruction) child.instruction = comp.instruction;
                return child;
              }),
            ],
          },
        })),
      };
      console.log('Submitting Flow:', JSON.stringify(payload, null, 2));
      return { error: '', status: 'SUBMITTED' };
    }),

  handleDragEnd: ({ active, over }) =>
    set((state) => {
      if (!over || active.id === over.id) return state;
      if (active.data.current?.type === 'SCREEN') {
        const oldIndex = state.screens.findIndex((screen) => screen.id === active.id);
        const newIndex = state.screens.findIndex((screen) => screen.id === over.id);
        if (oldIndex === -1 || newIndex === -1) {
          console.error('Invalid screen indices:', oldIndex, newIndex);
          return state;
        }
        const reorderedScreens = [...state.screens];
        const [movedScreen] = reorderedScreens.splice(oldIndex, 1);
        reorderedScreens.splice(newIndex, 0, movedScreen);
        return {
          screens: reorderedScreens,
          selectedScreenIndex: newIndex,
          currentPreviewScreen: newIndex,
        };
      } else if (active.data.current?.type === 'COMPONENT') {
        const screenIndex = active.data.current.screenIndex;
        if (
          screenIndex === undefined ||
          screenIndex < 0 ||
          screenIndex >= state.screens.length ||
          !state.screens[screenIndex]
        ) {
          console.error('Invalid screenIndex or screen not found:', screenIndex);
          return state;
        }
        const components = [...state.screens[screenIndex].components];
        const oldIndex = components.findIndex((comp) => comp.id === active.id);
        const newIndex = components.findIndex((comp) => comp.id === over.id);
        if (oldIndex === -1 || newIndex === -1) {
          console.error('Invalid component indices:', oldIndex, newIndex);
          return state;
        }
        const [movedComponent] = components.splice(oldIndex, 1);
        components.splice(newIndex, 0, movedComponent);
        const updatedScreens = [...state.screens];
        updatedScreens[screenIndex].components = components;
        return { screens: updatedScreens };
      }
      return state;
    }),
}));

export default useFlowStore;