# Migración segura del esquema heredado

El nuevo esquema utiliza tablas con nombres nuevos (`app_users`, `app_profiles`,
`auth_sessions`, etc.). Esto permite copiar y verificar datos antes de retirar
las tablas antiguas.

No ejecutar `prisma migrate reset`, `db push --accept-data-loss` ni una migración
automática contra producción.

Proceso recomendado:

1. Crear una copia completa de la base.
2. Generar y revisar SQL en una base local vacía.
3. Crear las tablas nuevas sin eliminar las heredadas.
4. Copiar usuarios transformando identificadores `Int` a nuevos identificadores
   `cuid` y contraseñas únicamente si contienen hashes válidos.
5. Migrar fitness relacionándolo con los nuevos usuarios.
6. Comparar conteos e integridad.
7. Cambiar la aplicación a las tablas nuevas.
8. Mantener las tablas antiguas durante una ventana de recuperación.
9. Retirarlas mediante una migración independiente y aprobada.

PayPal y economía comienzan sin datos heredados. Los modelos bancarios actuales
no se copian automáticamente porque no representan una billetera de juego.
