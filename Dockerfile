FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY alex-rakia.jpg /usr/share/nginx/html/alex-rakia.jpg
COPY alex-jacuzzi.jpg /usr/share/nginx/html/alex-jacuzzi.jpg
COPY alex-restaurant.jpg /usr/share/nginx/html/alex-restaurant.jpg

EXPOSE 80
