import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  StatusBar,
  ScrollView,
} from 'react-native';

export default function HomeScreen({ navigation, menuItems, menuCalculations }) {
  // NEW: Calculate average prices
  const averagePrices = menuCalculations.calculateAveragePrices(menuItems);

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

  // NEW: Render average price cards
  const renderAveragePriceCards = () => {
    const cards = [];
    
    // Using for...in loop to iterate through average prices
    for (const course in averagePrices) {
      const average = averagePrices[course];
      cards.push(
        <View key={course} style={styles.priceCard}>
          <Text style={styles.courseTitle}>{course}</Text>
          <Text style={styles.averagePrice}>R {average.toFixed(2)}</Text>
          <Text style={styles.averageLabel}>Average Price</Text>
        </View>
      );
    }

    return cards;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
      
      <ScrollView>
        {/* NEW: Average Prices Section */}
        <View style={styles.averageSection}>
          <Text style={styles.sectionTitle}>Average Prices by Course</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priceScroll}>
            <View style={styles.priceContainer}>
              {renderAveragePriceCards()}
            </View>
          </ScrollView>
        </View>

        <View style={styles.header}>
          <Text style={styles.totalText}>
            Total Menu Items: {menuItems.length}
          </Text>
          {/* NEW: Filter Button */}
          <Pressable 
            style={styles.filterButton}
            onPress={() => navigation.navigate('Filter')}
          >
            <Text style={styles.filterButtonText}>Filter by Course</Text>
          </Pressable>
        </View>

        {menuItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No menu items yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first dish
            </Text>
          </View>
        ) : (
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false} // Since we're in a ScrollView
          />
        )}
      </ScrollView>

      {/* FAB for adding items - MOVED TO CHEF MANAGEMENT SCREEN */}
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('ChefManagement')}
        android_ripple={{ color: '#fff', radius: 28 }}
      >
        <Text style={styles.fabText}>👨‍🍳</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  averageSection: {
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
  priceScroll: {
    marginHorizontal: -16,
  },
  priceContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  priceCard: {
    backgroundColor: '#6200ee',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  averagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  averageLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#03a9f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '300',
  },
});
