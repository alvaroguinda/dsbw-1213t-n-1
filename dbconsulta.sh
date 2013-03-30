#ª/bin/sh

## Script que muestra todos los registros que hay en la base de datos de encuestas

mongo ds051577.mongolab.com:51577/dsbw -u robot -p admin << EOF
	DBQuery.shellBatchSize = 300
	db.enquestes.find()
EOF


