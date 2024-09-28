@ECHO OFF
REM once npm run build is complete, this batch file can be run to deploy the build folder to VM
REM deploy [key path]
REM copies build.zip and deploy folder to VM folder and runs deploy.sh
REM certs folder needs to be created manually with cert pem file and key
IF "%1"=="" GOTO :HAVE_0

@ECHO ON
jar -cMf build.zip build
scp -i %1 build.zip ubuntu@locums.encoretime.co:/data/encoreui
scp -i %1 deploy/*.* ubuntu@locums.encoretime.co:/data/encoreui
ssh -i %1 ubuntu@locums.encoretime.co "/data/encoreui/deploy.sh"
del build.zip
@ECHO OFF
GOTO :END

:HAVE_0
ECHO "Arguments missing. deploy [keyPath]"

:END