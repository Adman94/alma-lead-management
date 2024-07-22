export const schema = {
    type: 'object',
    properties: {
      firstName: { type: 'string', minLength: 2 },
      lastName: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      linkedin: { type: 'string', format: 'uri' },
      visas: { 
        type: 'string',
        enum: ['work', 'student', 'tourist']
      },
      resume: { type: 'string', format: 'data-url' },
      openInput: { type: 'string', minLength: 10 }
    },
    required: ['firstName', 'lastName', 'email', 'linkedin', 'visas', 'resume', 'openInput']
  };
  
  export const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/firstName' },
      { type: 'Control', scope: '#/properties/lastName' },
      { type: 'Control', scope: '#/properties/email' },
      { type: 'Control', scope: '#/properties/linkedin' },
      { 
        type: 'Control', 
        scope: '#/properties/visas',
        options: {
          format: 'radio'
        }
      },
      { 
        type: 'Control', 
        scope: '#/properties/resume',
        options: {
          accept: '.pdf,.doc,.docx'
        }
      },
      { 
        type: 'Control', 
        scope: '#/properties/openInput',
        options: {
          multi: true
        }
      }
    ]
  };