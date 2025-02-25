#!/bin/sh

echo "Migrating data..."
python manage.py migrate

echo "Update static..."
python manage.py collectstatic --noinput

if [ "$(python manage.py shell -c 'from backend.models import Product; print(Product.objects.count())')" = "0" ]; then
  echo "Loading initial data..."
  python manage.py loaddata products_fixture.json
else
  echo "Skipping loaddata, data already exists."
fi

exec "$@"
