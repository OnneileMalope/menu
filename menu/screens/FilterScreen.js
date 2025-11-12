import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';

export default function FilterScreen({ navigation, menuItems, menuCalculations }) {
  const [selectedCourse, setSelectedCourse] = useState('All');
  const availableCourses = ['All', ...menuCalculations.getAvailableCourses(menuItems)];

  // NEW: Filter items based on selected course
  const getFilteredItems = () => {
    if (selectedCourse === 'All') {
      return menuItems;
    }
    return menuCalculations.filterByCourse(menuItems, selectedCourse);
  };

  const filteredItems = getFilteredItems();

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.courseTag}>{item.course}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>R {parseFloat(item.price).toFixed(2)}</Text>
    </View>
  );

  // NEW: Render course filter buttons
  const renderCourseFilters = () => {
    const filters = [];
    
    // Using for loop to render filter buttons
    for (let i = 0; i < availableCourses.length; i++) {
      const course = availableCourses[i];
      filters.push(
        <Pressable
          key={course}
          style={[
            styles.filterChip,
            selectedCourse === course && styles.filterChipActive
          ]}
          onPress={() => setSelectedCourse(course)}
        >
          <Text style={[
            styles.filterChipText,
            selectedCourse === course && styles.filterChipTextActive
          ]}>
            {course}
          </Text>
        </Pressable>
      );
    }
    
    return filters;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Course Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Filter by Course</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <View style={styles.filterContainer}>
              {renderCourseFilters()}
            </View>
          </ScrollView>
        </View>

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {selectedCourse === 'All' 
              ? `All Menu Items (${filteredItems.length})`
              : `${selectedCourse} Courses (${filteredItems.length})`
            }
          </Text>
        </View>

        {/* Filtered Menu Items */}
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedCourse === 'All' 
                ? 'No menu items available'
                : `No ${selectedCourse} items found`
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterScroll: {
    marginHorizontal: -16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  resultsHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listContent: {
    padding: 16,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dishName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  courseTag: {
    backgroundColor: '#6200ee',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});