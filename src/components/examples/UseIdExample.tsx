'use client'

import { useState, useId, useRef } from 'react'

/**
 * useId Hook Example - React Unique ID Generation
 * 
 * Hook này generate unique IDs cho accessible form controls và elements.
 * Rất hữu ích cho:
 * - Accessible form labels và inputs
 * - ARIA attributes (aria-describedby, aria-labelledby)
 * - Unique keys cho dynamic content
 * - Server-side rendering compatibility
 * - Avoiding ID conflicts trong component reuse
 */

interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio'
  value: string
  error?: string
  helpText?: string
  options?: string[]
  required?: boolean
}

const UseIdExample = () => {
  // Multiple useId calls for different form sections
  const loginFormId = useId()
  const registrationFormId = useId()
  const feedbackFormId = useId()
  const preferencesFormId = useId()
  const searchFormId = useId()
  
  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [feedbackData, setFeedbackData] = useState({
    rating: '5',
    category: 'general',
    message: '',
    contactBack: false
  })
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    language: 'en'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Generated unique IDs for form fields
  const fieldIds = {
    // Login form
    loginEmail: `${loginFormId}-email`,
    loginPassword: `${loginFormId}-password`,
    
    // Registration form  
    firstName: `${registrationFormId}-firstName`,
    lastName: `${registrationFormId}-lastName`,
    regEmail: `${registrationFormId}-email`,
    regPassword: `${registrationFormId}-password`,
    confirmPassword: `${registrationFormId}-confirmPassword`,
    acceptTerms: `${registrationFormId}-acceptTerms`,
    
    // Feedback form
    rating: `${feedbackFormId}-rating`,
    category: `${feedbackFormId}-category`,
    message: `${feedbackFormId}-message`,
    contactBack: `${feedbackFormId}-contactBack`,
    
    // Preferences
    theme: `${preferencesFormId}-theme`,
    notifications: `${preferencesFormId}-notifications`,
    language: `${preferencesFormId}-language`,
    
    // Search
    search: `${searchFormId}-query`
  }

  // Dynamic form builder component
  const DynamicFormBuilder = () => {
    const formId = useId()
    const [formFields, setFormFields] = useState<FormField[]>([
      {
        id: `${formId}-field-1`,
        label: 'Full Name',
        type: 'text',
        value: '',
        required: true,
        helpText: 'Enter your full name as it appears on your ID'
      },
      {
        id: `${formId}-field-2`,
        label: 'Email Address',
        type: 'email',
        value: '',
        required: true,
        helpText: 'We will use this to contact you'
      }
    ])

    const addField = () => {
      const newField: FormField = {
        id: `${formId}-field-${formFields.length + 1}`,
        label: `Field ${formFields.length + 1}`,
        type: 'text',
        value: ''
      }
      setFormFields([...formFields, newField])
    }

    const updateField = (index: number, updates: Partial<FormField>) => {
      const updatedFields = formFields.map((field, i) => 
        i === index ? { ...field, ...updates } : field
      )
      setFormFields(updatedFields)
    }

    return (
      <div className="space-y-4">
        <h4 className="font-medium">Dynamic Form Builder</h4>
        {formFields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${field.id}-label`} className="block text-sm font-medium mb-1">
                  Field Label:
                </label>
                <input
                  id={`${field.id}-label`}
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(index, { label: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor={`${field.id}-type`} className="block text-sm font-medium mb-1">
                  Field Type:
                </label>
                <select
                  id={`${field.id}-type`}
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value as FormField['type'] })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="password">Password</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>
            </div>
            
            {/* Preview of the generated field */}
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
              <label htmlFor={field.id} className="block text-sm font-medium mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  value={field.value}
                  onChange={(e) => updateField(index, { value: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  aria-describedby={field.helpText ? `${field.id}-help` : undefined}
                />
              ) : (
                <input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => updateField(index, { value: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  aria-describedby={field.helpText ? `${field.id}-help` : undefined}
                />
              )}
              {field.helpText && (
                <div id={`${field.id}-help`} className="text-xs text-gray-500 mt-1">
                  {field.helpText}
                </div>
              )}
              <div className="text-xs text-blue-600 mt-1">
                ID: {field.id}
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addField}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Field
        </button>
      </div>
    )
  }

  // Modal component với unique IDs
  const AccessibleModal = ({ isOpen, onClose, title, children }: {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
  }) => {
    const modalId = useId()
    const titleId = `${modalId}-title`
    const contentId = `${modalId}-content`

    if (!isOpen) return null

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={contentId}
          aria-modal="true"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 id={titleId} className="text-lg font-semibold">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <div id={contentId}>
            {children}
          </div>
        </div>
      </div>
    )
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  // Validation functions
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    
    if (!loginData.email) {
      newErrors[fieldIds.loginEmail] = 'Email is required'
    } else if (!validateEmail(loginData.email)) {
      newErrors[fieldIds.loginEmail] = 'Please enter a valid email'
    }
    
    if (!loginData.password) {
      newErrors[fieldIds.loginPassword] = 'Password is required'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      alert('Login form submitted successfully!')
    }
  }

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    
    if (!registrationData.firstName) {
      newErrors[fieldIds.firstName] = 'First name is required'
    }
    
    if (!registrationData.email) {
      newErrors[fieldIds.regEmail] = 'Email is required'
    } else if (!validateEmail(registrationData.email)) {
      newErrors[fieldIds.regEmail] = 'Please enter a valid email'
    }
    
    if (registrationData.password !== registrationData.confirmPassword) {
      newErrors[fieldIds.confirmPassword] = 'Passwords do not match'
    }
    
    if (!registrationData.acceptTerms) {
      newErrors[fieldIds.acceptTerms] = 'You must accept the terms and conditions'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      alert('Registration successful!')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🆔 useId Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook để generate unique IDs cho accessible form controls và elements. 
          Essential cho accessibility, form labels, ARIA attributes, và avoiding ID conflicts.
        </p>
      </div>

      {/* Generated IDs Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">
          🔧 Generated Unique IDs
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <div className="text-sm font-medium text-blue-800">Login Form ID:</div>
            <div className="text-xs text-blue-600 font-mono">{loginFormId}</div>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <div className="text-sm font-medium text-green-800">Registration Form ID:</div>
            <div className="text-xs text-green-600 font-mono">{registrationFormId}</div>
          </div>
          <div className="bg-orange-100 p-4 rounded">
            <div className="text-sm font-medium text-orange-800">Feedback Form ID:</div>
            <div className="text-xs text-orange-600 font-mono">{feedbackFormId}</div>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <div className="text-sm font-medium text-purple-800">Preferences Form ID:</div>
            <div className="text-xs text-purple-600 font-mono">{preferencesFormId}</div>
          </div>
          <div className="bg-pink-100 p-4 rounded">
            <div className="text-sm font-medium text-pink-800">Search Form ID:</div>
            <div className="text-xs text-pink-600 font-mono">{searchFormId}</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-sm text-blue-700">
            💡 Mỗi useId() call tạo ra một unique ID prefix. Combine với string suffix để tạo specific field IDs.
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🔐 Login Form (Accessible với useId)
        </h3>
        
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label htmlFor={fieldIds.loginEmail} className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              id={fieldIds.loginEmail}
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              className={`w-full px-3 py-2 border rounded-md ${
                errors[fieldIds.loginEmail] ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-describedby={errors[fieldIds.loginEmail] ? `${fieldIds.loginEmail}-error` : `${fieldIds.loginEmail}-help`}
              aria-invalid={!!errors[fieldIds.loginEmail]}
            />
            <div id={`${fieldIds.loginEmail}-help`} className="text-xs text-gray-500 mt-1">
              Enter your registered email address
            </div>
            {errors[fieldIds.loginEmail] && (
              <div id={`${fieldIds.loginEmail}-error`} className="text-xs text-red-600 mt-1" role="alert">
                {errors[fieldIds.loginEmail]}
              </div>
            )}
            <div className="text-xs text-blue-600 mt-1">Field ID: {fieldIds.loginEmail}</div>
          </div>

          <div>
            <label htmlFor={fieldIds.loginPassword} className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              id={fieldIds.loginPassword}
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className={`w-full px-3 py-2 border rounded-md ${
                errors[fieldIds.loginPassword] ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-describedby={errors[fieldIds.loginPassword] ? `${fieldIds.loginPassword}-error` : undefined}
              aria-invalid={!!errors[fieldIds.loginPassword]}
            />
            {errors[fieldIds.loginPassword] && (
              <div id={`${fieldIds.loginPassword}-error`} className="text-xs text-red-600 mt-1" role="alert">
                {errors[fieldIds.loginPassword]}
              </div>
            )}
            <div className="text-xs text-blue-600 mt-1">Field ID: {fieldIds.loginPassword}</div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          📝 Registration Form (Multiple useId Fields)
        </h3>
        
        <form onSubmit={handleRegistrationSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={fieldIds.firstName} className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                id={fieldIds.firstName}
                type="text"
                value={registrationData.firstName}
                onChange={(e) => setRegistrationData({...registrationData, firstName: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors[fieldIds.firstName] ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors[fieldIds.firstName]}
              />
              {errors[fieldIds.firstName] && (
                <div className="text-xs text-red-600 mt-1" role="alert">
                  {errors[fieldIds.firstName]}
                </div>
              )}
              <div className="text-xs text-blue-600 mt-1">ID: {fieldIds.firstName}</div>
            </div>

            <div>
              <label htmlFor={fieldIds.lastName} className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                id={fieldIds.lastName}
                type="text"
                value={registrationData.lastName}
                onChange={(e) => setRegistrationData({...registrationData, lastName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="text-xs text-blue-600 mt-1">ID: {fieldIds.lastName}</div>
            </div>
          </div>

          <div>
            <label htmlFor={fieldIds.regEmail} className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              id={fieldIds.regEmail}
              type="email"
              value={registrationData.email}
              onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
              className={`w-full px-3 py-2 border rounded-md ${
                errors[fieldIds.regEmail] ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={!!errors[fieldIds.regEmail]}
            />
            {errors[fieldIds.regEmail] && (
              <div className="text-xs text-red-600 mt-1" role="alert">
                {errors[fieldIds.regEmail]}
              </div>
            )}
            <div className="text-xs text-blue-600 mt-1">ID: {fieldIds.regEmail}</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={fieldIds.regPassword} className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                id={fieldIds.regPassword}
                type="password"
                value={registrationData.password}
                onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="text-xs text-blue-600 mt-1">ID: {fieldIds.regPassword}</div>
            </div>

            <div>
              <label htmlFor={fieldIds.confirmPassword} className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                id={fieldIds.confirmPassword}
                type="password"
                value={registrationData.confirmPassword}
                onChange={(e) => setRegistrationData({...registrationData, confirmPassword: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors[fieldIds.confirmPassword] ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors[fieldIds.confirmPassword]}
              />
              {errors[fieldIds.confirmPassword] && (
                <div className="text-xs text-red-600 mt-1" role="alert">
                  {errors[fieldIds.confirmPassword]}
                </div>
              )}
              <div className="text-xs text-blue-600 mt-1">ID: {fieldIds.confirmPassword}</div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id={fieldIds.acceptTerms}
              type="checkbox"
              checked={registrationData.acceptTerms}
              onChange={(e) => setRegistrationData({...registrationData, acceptTerms: e.target.checked})}
              className="mr-2"
              aria-invalid={!!errors[fieldIds.acceptTerms]}
            />
            <label htmlFor={fieldIds.acceptTerms} className="text-sm text-gray-700">
              I accept the Terms and Conditions *
            </label>
          </div>
          {errors[fieldIds.acceptTerms] && (
            <div className="text-xs text-red-600" role="alert">
              {errors[fieldIds.acceptTerms]}
            </div>
          )}
          <div className="text-xs text-blue-600">ID: {fieldIds.acceptTerms}</div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Create Account
          </button>
        </form>
      </div>

      {/* Search Component */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🔍 Search Component (useId for Accessibility)
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor={fieldIds.search} className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <div className="relative">
              <input
                id={fieldIds.search}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search terms..."
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md"
                aria-describedby={`${fieldIds.search}-help`}
              />
              <button
                type="button"
                className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            </div>
            <div id={`${fieldIds.search}-help`} className="text-xs text-gray-500 mt-1">
              Search across all content and documentation
            </div>
            <div className="text-xs text-blue-600 mt-1">Search Field ID: {fieldIds.search}</div>
          </div>

          {searchQuery && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium mb-2">Search Results for: "{searchQuery}"</div>
              <div className="space-y-2">
                <div className="p-2 bg-white rounded border">
                  <div className="font-medium text-sm">Result 1</div>
                  <div className="text-xs text-gray-600">Matching content preview...</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <div className="font-medium text-sm">Result 2</div>
                  <div className="text-xs text-gray-600">Another matching result...</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Form Builder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🛠️ Dynamic Form Builder (useId trong Components)
        </h3>
        <DynamicFormBuilder />
      </div>

      {/* Modal Example */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🪟 Accessible Modal (useId for ARIA)
        </h3>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Open Modal
        </button>

        <AccessibleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
        >
          <p className="text-gray-600 mb-4">
            This modal uses useId for proper ARIA labeling and accessibility.
            The title and content have unique IDs for screen readers.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
            <button
              onClick={() => alert('Action performed!')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Perform Action
            </button>
          </div>
        </AccessibleModal>
      </div>

      {/* Best Practices */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">
          💡 Best Practices cho useId
        </h3>
        <ul className="space-y-2 text-sm text-green-700">
          <li>• <strong>Form accessibility:</strong> Always link labels với inputs using unique IDs</li>
          <li>• <strong>ARIA attributes:</strong> Use cho aria-describedby, aria-labelledby, aria-controls</li>
          <li>• <strong>Component reusability:</strong> Ensure components có unique IDs khi reused</li>
          <li>• <strong>Server-side rendering:</strong> useId ensures consistent IDs between server và client</li>
          <li>• <strong>Don't use for keys:</strong> Never dùng useId cho React list keys</li>
          <li>• <strong>Prefix pattern:</strong> Combine useId với descriptive suffixes</li>
          <li>• <strong>Error handling:</strong> Link error messages với form fields using IDs</li>
          <li>• <strong>Modal dialogs:</strong> Use cho proper modal labeling và focus management</li>
        </ul>
      </div>

      {/* Code Examples */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          📝 Code Examples
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Basic Form Field:</h4>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded overflow-x-auto">
{`const MyComponent = () => {
  const id = useId()
  const fieldId = \`\${id}-email\`
  
  return (
    <div>
      <label htmlFor={fieldId}>Email:</label>
      <input
        id={fieldId}
        type="email"
        aria-describedby={\`\${fieldId}-help\`}
      />
      <div id={\`\${fieldId}-help\`}>
        Enter your email address
      </div>
    </div>
  )
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Modal với ARIA:</h4>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded overflow-x-auto">
{`const Modal = ({ title, children }) => {
  const id = useId()
  const titleId = \`\${id}-title\`
  const contentId = \`\${id}-content\`
  
  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={contentId}
      aria-modal="true"
    >
      <h2 id={titleId}>{title}</h2>
      <div id={contentId}>{children}</div>
    </div>
  )
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseIdExample 