pipeline {
  agent any
  tools { nodejs 'node20' }

  stages {
    stage('Install') {
      steps {
        dir('frontend') {
          sh 'npm ci'
        }
      }
    }

    stage('Test + Coverage') {
      steps {
        dir('frontend') {
          sh 'CI=true npm test -- --coverage --watchAll=false'
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        script {
          def scannerHome = tool 'SonarScanner'
          withSonarQubeEnv('SonarQube') {
            sh "${scannerHome}/bin/sonar-scanner"
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }
}