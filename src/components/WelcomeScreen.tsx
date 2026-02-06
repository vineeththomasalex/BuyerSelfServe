import React from 'react';
import { useTransaction } from '../hooks/useTransaction';
import { Button, Card, CardBody } from './common';

export function WelcomeScreen() {
  const { createTransaction } = useTransaction();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Texas Home Buyer Workflow
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              A guide for unrepresented home buyers in Texas through the purchase process
              from offer to closing.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">How this app helps you:</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Track all 9 phases of the home buying process with detailed tasks
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                See task dependencies - know what's blocking you and what you unblock
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Never miss a deadline - see upcoming dates at a glance
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Save snippets for quick copy-paste (addresses, names, etc.)
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                All data stored locally in your browser - 100% private
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">Important Notice:</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              This app is for educational and organizational purposes only. It is not legal
              advice. For legal questions about your real estate transaction, consult with a
              licensed Texas real estate attorney. TREC forms and processes may change -
              always verify current requirements with official sources.
            </p>
          </div>

          <div className="text-center">
            <Button size="lg" onClick={createTransaction}>
              Start New Transaction
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Your data is stored locally in your browser and syncs with your Chrome profile.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
