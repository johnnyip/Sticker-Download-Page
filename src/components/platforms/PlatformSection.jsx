import { useState } from 'react';
import { Accordion, Button, Group, Modal, SimpleGrid } from '@mantine/core';
import {
  IconArrowsDownUp,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
} from '@tabler/icons-react';

import LinkCard from './LinkCard.jsx';
import LinkCardMobile from './LinkCardMobile.jsx';

function buildStickerId(idPrefix, itemName) {
  return `${idPrefix}${itemName.replace('Machiko', '')}`;
}

export default function PlatformSection({
  links,
  idPrefix,
  installed,
  setInstalled,
  extraButton,
  infoButtonLabel,
  modalTitle,
  modalContent,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [reverseOrder, setReverseOrder] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [showNotInstalled, setShowNotInstalled] = useState(false);

  const displayedLinks = reverseOrder ? [...links].reverse() : links;
  const filteredLinks = displayedLinks
    .map((item) => ({
      ...item,
      stickerId: buildStickerId(idPrefix, item.name),
    }))
    .filter((item) => !showNotInstalled || !installed.includes(item.stickerId));

  const setDownloaded = (id) => {
    setInstalled((currentInstalled) => (
      currentInstalled.includes(id) ? currentInstalled : [...currentInstalled, id]
    ));
  };

  return (
    <>
      <hr />
      {infoButtonLabel ? (
        <>
          <Button leftIcon={<IconInfoCircle />} onClick={() => setModalOpen(true)}>
            {infoButtonLabel}
          </Button>
          <br />
          <br />
        </>
      ) : null}

      <Group position="center">
        <Button
          color="gray"
          leftIcon={<IconArrowsDownUp />}
          onClick={() => {
            setReverseOrder((currentValue) => !currentValue);
          }}
        >
          倒轉顯示順序
        </Button>
        <Button
          color="gray"
          leftIcon={showNotInstalled ? <IconEye /> : <IconEyeOff />}
          onClick={() => {
            setShowNotInstalled((currentValue) => !currentValue);
          }}
        >
          {showNotInstalled ? '顯示所有貼圖' : '只顯示未安裝貼圖'}
        </Button>
      </Group>

      {extraButton ? (
        <>
          {(() => {
            const ExtraButtonIcon = extraButton.icon;

            return (
          <a target="_blank" href={extraButton.href} rel="noreferrer">
            <Button leftIcon={<ExtraButtonIcon />}>{extraButton.label}</Button>
          </a>
            );
          })()}
          <br />
        </>
      ) : null}

      <hr />

      <SimpleGrid cols={4}>
        {filteredLinks.map((item) => {
          return (
            <div key={item.stickerId} className="link-card-desktop">
              <LinkCard
                data={item}
                id={item.stickerId}
                installed={installed.includes(item.stickerId)}
                setDownloaded={setDownloaded}
              />
            </div>
          );
        })}
      </SimpleGrid>

      <SimpleGrid cols={1}>
        {filteredLinks.map((item, index) => {
          return (
            <div key={`${item.stickerId}_mobile`} className="link-card-mobile">
              <Accordion value={activeTab} onChange={setActiveTab} variant="separated">
                <LinkCardMobile
                  size={filteredLinks.length}
                  data={item}
                  id={item.stickerId}
                  idHeader={idPrefix}
                  showNotInstalled={showNotInstalled}
                  installed={installed.includes(item.stickerId)}
                  setDownloaded={setDownloaded}
                  setActiveTab={setActiveTab}
                  previousId={index > 0 ? filteredLinks[index - 1].stickerId : ''}
                  nextId={index < filteredLinks.length - 1 ? filteredLinks[index + 1].stickerId : ''}
                />
              </Accordion>
            </div>
          );
        })}
      </SimpleGrid>

      {modalTitle && modalContent ? (
        <Modal
          centered
          className="center"
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalTitle}
        >
          {modalContent}
        </Modal>
      ) : null}
    </>
  );
}
