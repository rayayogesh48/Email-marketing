'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ImportScreenState } from '@/lib/mock-data/customer-import';
import { ImportPageHeader } from './import-page-header';
import { ImportStepper } from './import-stepper';
import { FileDropzone } from './file-dropzone';
import { SelectedFileCard } from './selected-file-card';
import { TemplateDownloadCard } from './template-download-card';
import { ExpectedColumns } from './expected-columns';
import { ColumnMappingTable } from './column-mapping-table';
import { CustomerPreviewTable } from './customer-preview-table';
import { ImportStatusCard } from './import-status-card';
import { ImportResultCard } from './import-result-card';
import { PreviewStateSwitcher } from './preview-state-switcher';

export function ImportPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stateQuery = searchParams.get('state') as ImportScreenState | null;

  // Active screen state
  const [screenState, setScreenState] = useState<ImportScreenState>('upload_file');

  // Sync state from URL query param if valid
  useEffect(() => {
    if (
      stateQuery &&
      [
        'upload_file',
        'file_selected',
        'map_columns',
        'customer_preview',
        'importing',
        'import_complete',
        'complete_with_skipped',
        'import_failed',
      ].includes(stateQuery)
    ) {
      setScreenState(stateQuery);
    }
  }, [stateQuery]);

  const handleStateChange = (nextState: ImportScreenState) => {
    setScreenState(nextState);
    const params = new URLSearchParams(searchParams.toString());
    params.set('state', nextState);
    router.replace(`/customers/import?${params.toString()}`, { scroll: false });
  };

  const handleResetPrototype = () => {
    setScreenState('upload_file');
    router.replace('/customers/import', { scroll: false });
  };

  // Determine active stepper step
  const getStepNumber = (): number => {
    switch (screenState) {
      case 'upload_file':
      case 'file_selected':
        return 1;
      case 'map_columns':
        return 2;
      case 'customer_preview':
        return 3;
      case 'importing':
      case 'import_complete':
      case 'complete_with_skipped':
      case 'import_failed':
        return 4;
      default:
        return 1;
    }
  };

  const isAllComplete =
    screenState === 'import_complete' || screenState === 'complete_with_skipped';

  return (
    <div className="w-full min-h-screen bg-[#f9f9f9] text-[#0a0a0a] pb-24">
      <div className="max-w-[1140px] mx-auto p-6 space-y-6">
        {/* Consistent Page Header */}
        <ImportPageHeader />

        {/* Step Indicator */}
        <ImportStepper
          currentStep={getStepNumber()}
          allCompleted={isAllComplete}
        />

        {/* Primary Content Card */}
        <div className="bg-white border border-[#ebebeb] rounded-xl shadow-xs overflow-hidden">
          {/* Main Content Area */}
          <div className="p-6">
            {/* State 01: Upload File */}
            {screenState === 'upload_file' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-[#0a0a0a]">
                    Upload your customer file
                  </h2>
                  <p className="text-xs text-[#71717a] mt-0.5">
                    Use the Reloopin template or upload a file with your existing customer data.
                  </p>
                </div>

                {/* Large Dropzone */}
                <FileDropzone onFileSelect={() => handleStateChange('file_selected')} />

                {/* Sample Template Download */}
                <TemplateDownloadCard />

                {/* Expandable Expected Columns */}
                <ExpectedColumns />
              </div>
            )}

            {/* State 02: File Selected */}
            {screenState === 'file_selected' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-[#0a0a0a]">
                    Upload your customer file
                  </h2>
                  <p className="text-xs text-[#71717a] mt-0.5">
                    Use the Reloopin template or upload a file with your existing customer data.
                  </p>
                </div>

                {/* Selected File Card */}
                <SelectedFileCard
                  onReplaceFile={() => handleStateChange('file_selected')}
                  onRemoveFile={() => handleStateChange('upload_file')}
                />

                {/* Sample Template Download */}
                <TemplateDownloadCard />

                {/* Expandable Expected Columns */}
                <ExpectedColumns />
              </div>
            )}

            {/* State 03: Map Columns */}
            {screenState === 'map_columns' && <ColumnMappingTable />}

            {/* State 04: Customer Preview */}
            {screenState === 'customer_preview' && <CustomerPreviewTable />}

            {/* State 05: Importing */}
            {screenState === 'importing' && (
              <ImportStatusCard onShowResult={() => handleStateChange('import_complete')} />
            )}

            {/* State 06: Import Complete */}
            {screenState === 'import_complete' && (
              <ImportResultCard
                variant="complete"
                onImportAnother={() => handleStateChange('upload_file')}
                onTryAgain={() => handleStateChange('file_selected')}
              />
            )}

            {/* State 07: Complete with Skipped Rows */}
            {screenState === 'complete_with_skipped' && (
              <ImportResultCard
                variant="complete_with_skipped"
                onImportAnother={() => handleStateChange('upload_file')}
                onTryAgain={() => handleStateChange('file_selected')}
              />
            )}

            {/* State 08: Import Failed */}
            {screenState === 'import_failed' && (
              <ImportResultCard
                variant="failed"
                onImportAnother={() => handleStateChange('upload_file')}
                onTryAgain={() => handleStateChange('file_selected')}
              />
            )}
          </div>

          {/* Predictable Bottom Action Bar (Only shown on interactive form screens 1, 2, 3, 4) */}
          {(screenState === 'upload_file' ||
            screenState === 'file_selected' ||
            screenState === 'map_columns' ||
            screenState === 'customer_preview') && (
            <div className="px-6 py-4 bg-[#fafafa] border-t border-[#ebebeb] flex items-center justify-between gap-4">
              {/* Left Action */}
              <div>
                {screenState === 'upload_file' || screenState === 'file_selected' ? (
                  <Link
                    href="/customers"
                    className="inline-flex items-center text-xs font-medium text-[#71717a] hover:text-[#0a0a0a] px-3 py-1.5 rounded-lg border border-[#ebebeb] bg-white hover:bg-[#fafafa] transition-colors"
                  >
                    Cancel
                  </Link>
                ) : screenState === 'map_columns' ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleStateChange('file_selected')}
                    className="h-8 text-xs font-medium border-[#ebebeb] bg-white text-[#0a0a0a] hover:bg-[#fafafa]"
                  >
                    <ArrowLeft className="size-3.5 mr-1.5" />
                    Back
                  </Button>
                ) : screenState === 'customer_preview' ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleStateChange('map_columns')}
                    className="h-8 text-xs font-medium border-[#ebebeb] bg-white text-[#0a0a0a] hover:bg-[#fafafa]"
                  >
                    <ArrowLeft className="size-3.5 mr-1.5" />
                    Back
                  </Button>
                ) : null}
              </div>

              {/* Right Action */}
              <div>
                {screenState === 'upload_file' ? (
                  <Button
                    type="button"
                    disabled
                    size="sm"
                    className="h-8 px-4 text-xs font-semibold bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  >
                    <span>Continue</span>
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Button>
                ) : screenState === 'file_selected' ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleStateChange('map_columns')}
                    className="h-8 px-4 text-xs font-semibold bg-[#5f3ed8] hover:bg-[#5034b8] text-white shadow-xs"
                  >
                    <span>Continue to mapping</span>
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Button>
                ) : screenState === 'map_columns' ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleStateChange('customer_preview')}
                    className="h-8 px-4 text-xs font-semibold bg-[#5f3ed8] hover:bg-[#5034b8] text-white shadow-xs"
                  >
                    <span>Continue to preview</span>
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Button>
                ) : screenState === 'customer_preview' ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleStateChange('importing')}
                    className="h-8 px-5 text-xs font-semibold bg-[#5f3ed8] hover:bg-[#5034b8] text-white shadow-xs"
                  >
                    Import 248 customers
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Preview States Controller */}
      <PreviewStateSwitcher
        currentState={screenState}
        onSelectState={handleStateChange}
        onReset={handleResetPrototype}
      />
    </div>
  );
}
