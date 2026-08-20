pipeline {
  agent any
  options { skipDefaultCheckout(true); disableConcurrentBuilds(); timestamps(); timeout(time: 20, unit: 'MINUTES'); buildDiscarder(logRotator(numToKeepStr: '30')) }
  environment { HOST_JENKINS_HOME = '/volume2/docker/jenkins'; DEPLOY_DIR = '/volume2/docker/wordpress-johnnyip/wp-content/reactpress/apps/sticker' }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Build and Deploy') { steps { sh '''set -eu
      host_source=$(printf '%s' "$PWD" | sed "s#^/var/jenkins_home#$HOST_JENKINS_HOME#")
      docker run --rm -v "$host_source:/source:ro" -v "$DEPLOY_DIR:/deploy" -w /workspace node:20-alpine sh -lc '
        cp -a /source/. /workspace
        npm ci
        npm run build
        mkdir -p /deploy/build
        find /deploy/build -mindepth 1 -exec rm -rf {} +
        cp -R ./build/. /deploy/build/
        find /deploy/build -maxdepth 3 -type f | sort
      '
    ''' } }
  }
  post { always { step([$class: 'Mailer', recipients: 'johnny@johnnyip.com', notifyEveryUnstableBuild: false, sendToIndividuals: false]); cleanWs deleteDirs: true, disableDeferredWipeout: true, notFailBuild: true } }
}
