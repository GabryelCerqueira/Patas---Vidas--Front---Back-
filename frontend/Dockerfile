# Imagem base Nginx Alpine ultra-leve (~25MB)
FROM nginx:alpine

# Remove configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copia a configuração com proxy reverso e cache
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia todos os arquivos do frontend para o diretório raiz web do Nginx
COPY . /usr/share/nginx/html

# Remove arquivos de build que não devem ser servidos publicamente
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
