describe('Validation Tests', () => {
  // Email validation
  describe('Email Validation', () => {
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    test('should validate correct email format', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('john.doe@company.co.uk')).toBe(true);
    });

    test('should reject invalid email format', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  // Password validation
  describe('Password Validation', () => {
    const validatePassword = (pwd) => pwd.length >= 6;

    test('should accept strong passwords', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('SecurePass456')).toBe(true);
    });

    test('should reject weak passwords', () => {
      expect(validatePassword('123')).toBe(false);
      expect(validatePassword('pass')).toBe(false);
    });
  });

  // Phone number validation
  describe('Phone Number Validation', () => {
    const validatePhone = (phone) => {
      const phoneRegex = /^[0-9]{10}$/;
      return phoneRegex.test(phone.replace(/\D/g, ''));
    };

    test('should validate correct phone numbers', () => {
      expect(validatePhone('9876543210')).toBe(true);
      expect(validatePhone('98-765-43210')).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abcdefghij')).toBe(false);
    });
  });
});
