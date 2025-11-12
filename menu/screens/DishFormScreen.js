import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

// NEW: Global constants
const COURSES = ['Starter', 'Main', 'Dessert'];
const MIN_NAME_LENGTH = 2;
const MIN_DESC_LENGTH = 10;

// NEW: Validation function using TypeScript-style approach
const validateMenuItem = (name, description, price, course) => {
  const errors = [];
  
  // Using for loop to check required fields
  const requiredFields = [name, description, price, course];
  const fieldNames = ['Name', 'Description', 'Price', 'Course'];
  
  for (let i = 0; i < requiredFields.length; i++) {
    if (!requiredFields[i] || requiredFields[i].toString().trim() === '') {
      errors.push(`${fieldNames[i]} is required`);
    }
  }

  // Using while loop for length validation
  let nameValid = true;
  let descValid = true;
  
  if (name.trim().length < MIN_NAME_LENGTH) {
    nameValid = false;
    errors.push(`Name must be at least ${MIN_NAME_LENGTH} characters`);
  }
  
  if (description.trim().length < MIN_DESC_LENGTH) {
    descValid = false;
    errors.push(`Description must be at least ${MIN_DESC_LENGTH} characters`);
  }

  // Price validation
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    errors.push('Price must be a number greater than 0');
  }

  return errors;
};

// NEW: Price formatting function
const formatPrice = (price) => {
  if (!price) return '';
  // Remove any non-numeric characters except decimal point
  const numericValue = price.replace(/[^0-9.]/g, '');
  // Ensure only one decimal point
  const parts = numericValue.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  return numericValue;
};

export default function DishFormScreen({ navigation, route, addMenuItem, updateMenuItem }) {
  const editing = !!route.params?.item;
  const item = route.params?.item;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Main');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (editing && item) {
      setName(item.name || '');
      setDescription(item.description || '');
      setCourse(item.course || 'Main');
      setPrice(item.price != null ? item.price.toString() : '');
    }
  }, [editing, item]);

  // NEW: Function to handle price input
  const handlePriceChange = (text) => {
    const formattedPrice = formatPrice(text);
    setPrice(formattedPrice);
  };

  // NEW: Save function with enhanced validation
  const handleSave = () => {
    const validationErrors = validateMenuItem(name, description, price, course);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      
      // Using for loop to show all errors
      let errorMessage = 'Please fix the following errors:\n';
      for (let i = 0; i < validationErrors.length; i++) {
        errorMessage += `• ${validationErrors[i]}\n`;
      }
      
      Alert.alert('Validation Error', errorMessage);
      return;
    }

    setErrors([]);
    
    const menuItemData = {
      name: name.trim(),
      description: description.trim(),
      course,
      price: parseFloat(parseFloat(price).toFixed(2))
    };

    let success = false;
    
    if (editing) {
      menuItemData.id = item.id;
      success = updateMenuItem(menuItemData);
    } else {
      success = addMenuItem(menuItemData);
    }

    if (success) {
      Alert.alert(
        'Success', 
        editing ? 'Menu item updated successfully!' : 'Menu item added successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Error', 'Failed to save menu item. Please try again.');
    }
  };

  // NEW: Function to render course chips using for loop
  const renderCourseChips = () => {
    const chips = [];
    
    for (let i = 0; i < COURSES.length; i++) {
      const courseOption = COURSES[i];
      chips.push(
        <Pressable 
          key={courseOption} 
          onPress={() => setCourse(courseOption)} 
          style={[
            styles.chip, 
            course === courseOption && styles.chipActive
          ]}
        >
          <Text style={course === courseOption ? styles.chipTextActive : styles.chipText}>
            {courseOption}
          </Text>
        </Pressable>
      );
    }
    
    return chips;
  };

  // NEW: Function to render error messages
  const renderErrors = () => {
    if (errors.length === 0) return null;

    const errorElements = [];
    let i = 0;
    
    // Using while loop to render errors
    while (i < errors.length) {
      errorElements.push(
        <Text key={i} style={styles.errorText}>
          • {errors[i]}
        </Text>
      );
      i++;
    }

    return (
      <View style={styles.errorContainer}>
        {errorElements}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {editing ? 'Edit Menu Item' : 'Add New Menu Item'}
          </Text>

          {/* Error Messages */}
          {renderErrors()}

          {/* Dish Name */}
          <Text style={styles.label}>Dish Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="E.g., Pan-seared Salmon"
            placeholderTextColor="#999"
            maxLength={50}
          />
          <Text style={styles.charCount}>
            {name.length}/50 characters
          </Text>

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            placeholder="Describe the dish, ingredients, and preparation..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={200}
          />
          <Text style={styles.charCount}>
            {description.length}/200 characters
          </Text>

          {/* Course Selection */}
          <Text style={styles.label}>Course *</Text>
          <View style={styles.courseContainer}>
            {renderCourseChips()}
          </View>

          {/* Price */}
          <Text style={styles.label}>Price (ZAR) *</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>R</Text>
            <TextInput
              value={price}
              onChangeText={handlePriceChange}
              style={[styles.input, styles.priceInput]}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                {editing ? 'Update' : 'Save'} Menu Item
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'right',
    marginTop: 4,
  },
  courseContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  chipActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  chipText: {
    color: '#495057',
    fontWeight: '600',
    fontSize: 14,
  },
  chipTextActive: {
    color: '#fff',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  priceInput: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});