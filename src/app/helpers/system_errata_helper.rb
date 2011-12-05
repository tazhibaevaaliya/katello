#
# Copyright 2011 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module SystemErrataHelper
  
  def errata_type_class errata
    case errata.errata_type
      when  Glue::Pulp::Errata::SECURITY
        return "security_icon"
      when  Glue::Pulp::Errata::ENHANCEMENT
        return "enhancement_icon"
      when  Glue::Pulp::Errata::BUGZILLA
        return "bugzilla_icon"
    end
  end

end