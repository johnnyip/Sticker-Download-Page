pipeline {
  agent any
  options { skipDefaultCheckout(true); disableConcurrentBuilds(); timestamps(); timeout(time: 20, unit: 'MINUTES'); buildDiscarder(logRotator(numToKeepStr: '30')) }
  environment { HOST_JENKINS_WORKSPACE = '/home/johnny/docker/jenkins-workspace' }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Build Complete Release') { steps { sh '''set -eu
      test ! -e .publish
      mkdir .publish
      host_source=$(printf '%s' "$PWD" | sed "s#^/var/jenkins_home/workspace#$HOST_JENKINS_WORKSPACE#")
      docker run --rm -v "$host_source:/source:ro" -v "$host_source/.publish:/publish" -w /workspace node:20-alpine sh -lc '
        set -eu
        cp -a /source/. /workspace
        npm ci
        npm run build
        test -f build/index.html
        test -f build/asset-manifest.json
        cp -R build /publish/build
        chown -R 1000:1000 /publish/build
      '
      python3 tools/deploy/sticker_release.py pack
    ''' } }
    stage('Publish DMZ Release') { steps { sh '''set -eu
      python3 tools/deploy/sticker_release.py publish
    ''' } }
    stage('Verify Public Release') { steps { sh '''set -eu
      python3 tools/deploy/sticker_release.py verify
    ''' } }
  }
  post {
    always {
      archiveArtifacts artifacts: '.publish/*.json,.publish/release.tar.gz', allowEmptyArchive: true, fingerprint: true
      step([$class: 'Mailer', recipients: 'johnny@johnnyip.com', notifyEveryUnstableBuild: false, sendToIndividuals: false])
      cleanWs deleteDirs: true, disableDeferredWipeout: true, notFailBuild: true
    }
  }
}
