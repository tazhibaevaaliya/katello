require 'katello_test_helper'

module Katello
  class AlternateContentSourceCreateTest < ActiveSupport::TestCase
    let(:proxy) { FactoryBot.create(:http_proxy) }

    def setup
      @yum_acs = katello_alternate_content_sources(:yum_alternate_content_source)
      @file_acs = katello_alternate_content_sources(:file_alternate_content_source)
      Setting['content_default_http_proxy'] = proxy.name
    end

    def test_create
      assert @yum_acs.save
      refute_empty AlternateContentSource.where(id: @yum_acs.id)
    end

    def test_subpaths
      @yum_acs.subpaths = ['test/', 'some_files/'].sort
      assert @yum_acs.save
      assert_equal @yum_acs.subpaths.sort, ['test/', 'some_files/'].sort
    end

    def test_smart_proxies
      assert @yum_acs.save
      SmartProxyAlternateContentSource.create(alternate_content_source_id: @yum_acs.id, smart_proxy_id: ::SmartProxy.pulp_primary.id, remote_href: 'remote_href', alternate_content_source_href: 'acs_href')
      @yum_acs.reload
      assert_equal @yum_acs.smart_proxies, [::SmartProxy.pulp_primary]
    end

    def test_http_proxy
      @yum_acs.http_proxy = proxy
      assert @yum_acs.save
      assert @yum_acs.http_proxy = proxy
    end

    def test_custom_missing_base_url
      @yum_acs.base_url = nil
      assert_raises(ActiveRecord::RecordInvalid, "Base url can\'t be blank") do
        @yum_acs.save!
      end
    end

    def test_custom_missing_verify_ssl
      @yum_acs.verify_ssl = nil
      assert_raises(ActiveRecord::RecordInvalid, "Verify ssl can\'t be blank") do
        @yum_acs.save!
      end
    end

    def test_wrong_acs_type
      @yum_acs.alternate_content_source_type = 'definitely not an ACS type'
      assert_raises(ActiveRecord::RecordInvalid, "Alternate content source type is not a valid type. Must be one of the following: #{AlternateContentSource::ACS_TYPES.join(',')}") do
        @yum_acs.save!
      end
    end

    def test_wrong_content_type
      @yum_acs.content_type = 'emu'
      assert_raises(ActiveRecord::RecordInvalid, "Content type is not allowed for ACS. Must be one of the following: #{AlternateContentSource::CONTENT_TYPES.join(',')}") do
        @yum_acs.save!
      end
    end

    def test_custom?
      @yum_acs.save!
      assert @yum_acs.custom?
    end

    def test_with_type
      @yum_acs.save!
      assert_equal [@yum_acs], AlternateContentSource.with_type('yum')
    end
  end

  class AlternateContentSourceSearchTest < ActiveSupport::TestCase
    def setup
      @yum_acs = katello_alternate_content_sources(:yum_alternate_content_source)
      @yum_acs.subpaths = ['rpms/', 'packages/']
      SmartProxyAlternateContentSource.create(alternate_content_source_id: @yum_acs.id, smart_proxy_id: ::SmartProxy.pulp_primary.id, remote_href: 'remote_href', alternate_content_source_href: 'acs_href')
      @yum_acs.save
      @yum_acs.reload

      @file_acs = katello_alternate_content_sources(:file_alternate_content_source)
      @file_acs.subpaths = ['files/', 'selif/']
      SmartProxyAlternateContentSource.create(alternate_content_source_id: @file_acs.id, smart_proxy_id: ::SmartProxy.pulp_primary.id, remote_href: 'remote_href2', alternate_content_source_href: 'acs_href2')
      @file_acs.save
      @file_acs.reload
    end

    def test_search_name
      acss = AlternateContentSource.search_for("name = \"#{@yum_acs.name}\"")
      assert_equal acss, [@yum_acs]
    end

    def test_search_label
      acss = AlternateContentSource.search_for("label = \"#{@yum_acs.label}\"")
      assert_equal acss, [@yum_acs]
    end

    def test_search_base_url
      acss = AlternateContentSource.search_for("base_url = \"#{@yum_acs.base_url}\"")
      assert_equal acss.sort, [@file_acs, @yum_acs].sort
    end

    def test_search_subpath
      acss = AlternateContentSource.search_for("subpath = \"rpms\/\"")
      assert_equal acss, [@yum_acs]
      acss = AlternateContentSource.search_for("subpath = \"packages\/\"")
      assert_equal acss, [@yum_acs]
    end

    def test_search_content_type
      acss = AlternateContentSource.search_for("content_type = \"#{@yum_acs.content_type}\"")
      assert_equal acss, [@yum_acs]
    end

    def test_search_acs_type
      acss = AlternateContentSource.search_for("alternate_content_source_type = \"#{@yum_acs.alternate_content_source_type}\"")
      assert_equal acss.sort, [@file_acs, @yum_acs].sort
    end

    def test_search_upstream_username
      acss = AlternateContentSource.search_for("upstream_username = \"#{@yum_acs.upstream_username}\"")
      assert_equal acss.sort, [@file_acs, @yum_acs].sort
    end

    def test_search_smart_proxy_id
      acss = AlternateContentSource.search_for("smart_proxy_id = \"#{@yum_acs.smart_proxy_ids.first}\"")
      assert_equal acss.sort, [@file_acs, @yum_acs].sort
    end
  end
end
