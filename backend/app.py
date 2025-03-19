from flask import Flask, jsonify
from flask_cors import CORS
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Generate dummy data for dashboard
def generate_dummy_sales_data():
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return [random.randint(5000, 20000) for _ in range(12)], months

def generate_dummy_inventory_data():
    categories = ["Electronics", "Clothing", "Food", "Furniture", "Books"]
    return [random.randint(100, 500) for _ in range(5)], categories

def generate_dummy_purchase_data():
    suppliers = ["Supplier A", "Supplier B", "Supplier C", "Supplier D"]
    return [random.randint(2000, 10000) for _ in range(4)], suppliers

def generate_daily_sales():
    days = 7
    today = datetime.now()
    labels = [(today - timedelta(days=i)).strftime('%a') for i in range(days-1, -1, -1)]
    data = [random.randint(100, 500) for _ in range(days)]
    return data, labels

# API Routes
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    sales_data, sales_labels = generate_dummy_sales_data()
    daily_sales, daily_labels = generate_daily_sales()
    
    return jsonify({
        'kpis': {
            'total_sales': random.randint(50000, 100000),
            'total_orders': random.randint(500, 1000),
            'total_customers': random.randint(200, 500),
            'average_order_value': random.randint(100, 300),
            'conversion_rate': round(random.uniform(2.0, 5.0), 2),
            'revenue_growth': round(random.uniform(-2.0, 8.0), 2)
        },
        'charts': {
            'monthly_sales': {
                'labels': sales_labels,
                'data': sales_data
            },
            'daily_sales': {
                'labels': daily_labels,
                'data': daily_sales
            }
        }
    })

@app.route('/api/inventory', methods=['GET'])
def get_inventory_data():
    inventory_data, categories = generate_dummy_inventory_data()
    
    return jsonify({
        'kpis': {
            'total_items': random.randint(1000, 5000),
            'low_stock_items': random.randint(10, 50),
            'out_of_stock': random.randint(5, 20),
            'inventory_value': random.randint(50000, 200000),
            'inventory_turnover': round(random.uniform(2.0, 8.0), 2),
            'average_days_in_inventory': random.randint(15, 60)
        },
        'charts': {
            'inventory_by_category': {
                'labels': categories,
                'data': inventory_data
            }
        }
    })

@app.route('/api/sales', methods=['GET'])
def get_sales_data():
    sales_data, months = generate_dummy_sales_data()
    
    return jsonify({
        'kpis': {
            'total_revenue': random.randint(100000, 500000),
            'total_profit': random.randint(30000, 150000),
            'profit_margin': round(random.uniform(15.0, 35.0), 2),
            'average_order_value': random.randint(100, 300),
            'return_rate': round(random.uniform(1.0, 5.0), 2),
            'customer_lifetime_value': random.randint(500, 2000)
        },
        'charts': {
            'monthly_revenue': {
                'labels': months,
                'data': sales_data
            }
        }
    })

@app.route('/api/purchase', methods=['GET'])
def get_purchase_data():
    purchase_data, suppliers = generate_dummy_purchase_data()
    
    return jsonify({
        'kpis': {
            'total_purchase_value': random.randint(50000, 200000),
            'total_orders': random.randint(100, 500),
            'average_order_value': random.randint(500, 2000),
            'pending_orders': random.randint(5, 30),
            'supplier_count': random.randint(10, 50),
            'on_time_delivery_rate': round(random.uniform(80.0, 98.0), 2)
        },
        'charts': {
            'purchase_by_supplier': {
                'labels': suppliers,
                'data': purchase_data
            }
        }
    })

@app.route('/api/reports', methods=['GET'])
def get_report_data():
    return jsonify({
        'kpis': {
            'revenue_growth': round(random.uniform(5.0, 15.0), 2),
            'profit_growth': round(random.uniform(3.0, 12.0), 2),
            'customer_growth': round(random.uniform(2.0, 10.0), 2),
            'average_order_growth': round(random.uniform(-1.0, 8.0), 2),
            'inventory_turnover_change': round(random.uniform(-2.0, 5.0), 2),
            'return_rate_change': round(random.uniform(-3.0, 1.0), 2)
        }
    })

@app.route('/api/user', methods=['GET'])
def get_user_data():
    return jsonify({
        'name': 'Admin User',
        'email': 'admin@example.com',
        'role': 'Administrator',
        'avatar': 'https://randomuser.me/api/portraits/men/1.jpg',
        'lastLogin': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    })

if __name__ == '__main__':
    app.run(debug=True) 