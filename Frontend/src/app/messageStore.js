import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMessageStore = create(
  persist(
    (set, get) => ({
      // State
      sidebarOpen: false,
      userDropdownOpen: false,
      activeNavItem: 'message',
      recipientType: 'single',
      phoneNumber: '',
      group: '',
      bulkFile: null,
      messageType: 'new',
      selectedTemplate: null,
      text: '',
      mediaType: 'none',
      mediaFile: null,
      mediaFileUrl: null, // Store URL for cleanup
      interactiveType: 'none',
      buttons: [],
      sendNow: true,
      scheduleDate: '',
      scheduleTime: '',
      repeat: 'none',
      error: '',
      variableCount: 1,
      sampleValues: {},
      locationLat: '',
      locationLong: '',
      locationName: '',
      locationAddress: '',
      contactFormattedName: '',
      contactFirstName: '',
      contactLastName: '',
      contactPhone: '',
      contactEmail: '',
      country: '',

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleUserDropdown: () => set((state) => ({ userDropdownOpen: !state.userDropdownOpen })),
      setActiveNavItem: (item) =>
        set((state) => ({
          activeNavItem: item,
          sidebarOpen: window.innerWidth < 768 ? false : state.sidebarOpen,
        })),
      setRecipientType: (type) => set({ recipientType: type, error: '' }),
      setPhoneNumber: (value) => {
        const error = !value
          ? get().recipientType === 'single' ? 'Phone number is required.' : ''
          : !/^\+?[1-9]\d{0,15}$/.test(value.replace(/[\s\-()]/g, ''))
          ? 'Please enter a valid phone number.'
          : '';
        set({ phoneNumber: value, error });
      },
      setGroup: (value) => set({ group: value, error: value ? '' : get().recipientType === 'group' ? 'Group selection is required.' : '' }),
      setBulkFile: (file) => set((state) => ({
        bulkFile: file,
        error: file ? '' : state.recipientType === 'bulk' ? 'CSV file is required.' : '',
      })),
      setMessageType: (type) => set({ messageType: type, error: '' }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template, error: '' }),
      setText: (value) => {
        const variables = value.match(/\{\{[0-9]+\}\}/g) || [];
        const maxVariable = variables.length > 0 ? Math.max(...variables.map((v) => parseInt(v.match(/[0-9]+/)[0]))) : 0;
        const newSampleValues = {};
        variables.forEach((variable) => {
          newSampleValues[variable] = get().sampleValues[variable] || '';
        });
        set({
          text: value,
          variableCount: maxVariable + 1,
          sampleValues: newSampleValues,
          error: value || get().mediaType !== 'none' || get().interactiveType !== 'none' ? '' : 'Message content is required.',
        });
      },
      setMediaType: (type) => set({ mediaType: type, error: '' }),
      setMediaFile: (file) => {
        const previousUrl = get().mediaFileUrl;
        const newUrl = file ? URL.createObjectURL(file) : null;
        if (previousUrl) URL.revokeObjectURL(previousUrl);
        set({
          mediaFile: file,
          mediaFileUrl: newUrl,
          error: file || get().text || get().interactiveType !== 'none' ? '' : 'Message content is required.',
        });
      },
      setInteractiveType: (type) => set({ interactiveType: type, error: '' }),
      addButton: () => set((state) => ({
        buttons: [...state.buttons, { type: 'URL', text: '', url: '', phone: '' }],
      })),
      removeButton: (index) => set((state) => ({
        buttons: state.buttons.filter((_, i) => i !== index),
      })),
      updateButton: (index, field, value) =>
        set((state) => {
          const updatedButtons = [...state.buttons];
          updatedButtons[index] = {
            ...updatedButtons[index],
            [field]: value,
            url: field === 'url' ? value : updatedButtons[index].url || '',
            phone: field === 'phone' ? value : updatedButtons[index].phone || '',
          };
          return { buttons: updatedButtons };
        }),
      setSendNow: (value) => set({ sendNow: value, error: '' }),
      setScheduleDate: (value) => set({ scheduleDate: value, error: value && get().scheduleTime ? '' : !get().sendNow ? 'Schedule date and time are required.' : '' }),
      setScheduleTime: (value) => set({ scheduleTime: value, error: value && get().scheduleDate ? '' : !get().sendNow ? 'Schedule date and time are required.' : '' }),
      setRepeat: (value) => set({ repeat: value }),
      setError: (value) => set({ error: value }),
      addVariable: () =>
        set((state) => {
          const variable = `{{${state.variableCount}}}`;
          const textarea = document.activeElement;
          const start = textarea?.selectionStart || state.text.length;
          const end = textarea?.selectionEnd || state.text.length;
          const newText = state.text.substring(0, start) + variable + state.text.substring(end);
          return {
            text: newText,
            variableCount: state.variableCount + 1,
            sampleValues: { ...state.sampleValues, [variable]: '' },
          };
        }),
      setSampleValue: (variable, value) =>
        set((state) => ({
          sampleValues: { ...state.sampleValues, [variable]: value },
        })),
      setLocationLat: (value) => set({ locationLat: value }),
      setLocationLong: (value) => set({ locationLong: value }),
      setLocationName: (value) => set({ locationName: value }),
      setLocationAddress: (value) => set({ locationAddress: value }),
      setContactFormattedName: (value) => set({ contactFormattedName: value }),
      setContactFirstName: (value) => set({ contactFirstName: value }),
      setContactLastName: (value) => set({ contactLastName: value }),
      setContactPhone: (value) => {
        const error = !value
          ? ''
          : !/^\+?[1-9]\d{0,15}$/.test(value.replace(/[\s\-()]/g, ''))
          ? 'Please enter a valid contact phone number.'
          : '';
        set({ contactPhone: value, error });
      },
      setContactEmail: (value) => {
        const error = !value
          ? ''
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Please enter a valid email address.'
          : '';
        set({ contactEmail: value, error });
      },
      setCountry: (value) => set({ country: value }),
      clearForm: () =>
        set((state) => {
          if (state.mediaFileUrl) URL.revokeObjectURL(state.mediaFileUrl);
          return {
            recipientType: 'single',
            phoneNumber: '',
            group: '',
            bulkFile: null,
            messageType: 'new',
            selectedTemplate: null,
            text: '',
            mediaType: 'none',
            mediaFile: null,
            mediaFileUrl: null,
            interactiveType: 'none',
            buttons: [],
            sendNow: true,
            scheduleDate: '',
            scheduleTime: '',
            repeat: 'none',
            error: '',
            variableCount: 1,
            sampleValues: {},
            locationLat: '',
            locationLong: '',
            locationName: '',
            locationAddress: '',
            contactFormattedName: '',
            contactFirstName: '',
            contactLastName: '',
            contactPhone: '',
            contactEmail: '',
            country: '',
          };
        }),
      submit: () => {
        const state = get();
        // Validation
        if (state.recipientType === 'single' && !state.phoneNumber) {
          set({ error: 'Phone number is required for single recipient.' });
          return;
        }
        if (state.recipientType === 'single' && state.phoneNumber && !/^\+?[1-9]\d{0,15}$/.test(state.phoneNumber.replace(/[\s\-()]/g, ''))) {
          set({ error: 'Please enter a valid phone number.' });
          return;
        }
        if (state.recipientType === 'group' && !state.group) {
          set({ error: 'Group selection is required.' });
          return;
        }
        if (state.recipientType === 'bulk' && !state.bulkFile) {
          set({ error: 'CSV file is required for bulk recipients.' });
          return;
        }
        if (state.messageType === 'new' && !state.text && state.mediaType === 'none' && state.interactiveType === 'none') {
          set({ error: 'Message content is required.' });
          return;
        }
        if (state.messageType === 'template' && !state.selectedTemplate) {
          set({ error: 'Template selection is required.' });
          return;
        }
        if (!state.sendNow && (!state.scheduleDate || !state.scheduleTime)) {
          set({ error: 'Schedule date and time are required.' });
          return;
        }
        if (state.mediaType === 'contacts' && state.contactPhone && !/^\+?[1-9]\d{0,15}$/.test(state.contactPhone.replace(/[\s\-()]/g, ''))) {
          set({ error: 'Please enter a valid contact phone number.' });
          return;
        }
        if (state.mediaType === 'contacts' && state.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contactEmail)) {
          set({ error: 'Please enter a valid contact email address.' });
          return;
        }
        console.log('Submitting message:', {
          recipientType: state.recipientType,
          phoneNumber: state.phoneNumber,
          group: state.group,
          bulkFile: state.bulkFile,
          messageType: state.messageType,
          selectedTemplate: state.selectedTemplate,
          text: state.text,
          mediaType: state.mediaType,
          mediaFile: state.mediaFile,
          interactiveType: state.interactiveType,
          buttons: state.buttons,
          sendNow: state.sendNow,
          scheduleDate: state.scheduleDate,
          scheduleTime: state.scheduleTime,
          repeat: state.repeat,
          sampleValues: state.sampleValues,
          locationLat: state.locationLat,
          locationLong: state.locationLong,
          locationName: state.locationName,
          locationAddress: state.locationAddress,
          contactFormattedName: state.contactFormattedName,
          contactFirstName: state.contactFirstName,
          contactLastName: state.contactLastName,
          contactPhone: state.contactPhone,
          contactEmail: state.contactEmail,
          country: state.country,
        });
        set({ error: '' });
        // Replace console.log with WhatsApp API call
      },
    }),
    {
      name: 'message-store',
    }
  )
);

export default useMessageStore;